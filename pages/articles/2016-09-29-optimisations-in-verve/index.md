---
layout: post
title: "Optimisations in Verve"
date: 2016-09-30 10:47:06
description: 'Premature optimisations for fun!'
image: 'verve-logo.jpg'
path: /optimisations-in-verve/
category:
- interpreter
- verve
- x86
- asm
twitter_text: "Optimisations in Verve: Premature optimisations for fun!"
---

I have definitely heard that "Premature optimisation is the root of all evil" and all that stuff, but well, sometimes optimising things can be fun.

I started [Verve] as a Virtual Machine (VM) rather than as a programming language, just for fun, since I was starting to dig into [JavaScriptCore] (JSC), and thought it'd be nice to try implementing a small VM.

## MVP

My first milestone was the easiest possible, execute a simple program, like "Hello, World". However, in order to achieve that, I needed to write this program somehow, and I chose to start with a lisp-like simple language, since it's as easy to parse as it gets.

```clojure
(print "Hello, World!")
```

Since my main goal was building the VM, I started with some kind of bytecode right away, rather than interpreting the AST at first.

As soon as my compiler front-end was smart enough to spit out some bytecode for simple function calls I jumped straight into the fun part: writing the interpreter.

It started out the simplest way I could think of: a big switch on the opcode (a simple `int` in this case). [original interpreter][initial-interpreter]

I was pretty happy with the result, given that everything kinda worked and I had only spent a few days. But I needed some new milestone to keep the motivation going.

## fib(40)

And that would be my next milestone: beat JSC on `fib(40)`. I know, it's meaningless, and please, **I'm not saying my dummy VM is faster than ANY real VM**, but still, seemed like a fun goal.
```rust
// the Fibonacci implementation
fn fib(n: int) -> int {
  if (n < 2) n
  else fib(n-1) + fib(n-2)
}
```

At first, I admit I thought it wouldn't be too hard: JSC is a full-featured VM, but it has to do way more work than my rather simplistic VM:

* First of all: I wasn't considering the JIT, only interpreter vs interpreter.
* JavaScript is not a simple language to parse, I only had my lisp-like dummy language.
* It deals with caches, profiles, counters, and many other things, which add overhead.
* It has much more code, which affects load time, cache locality, etc.
* The interpreter is written in a high-level assembly language, which doesn't allow abusing platform specific registers.

So I decided to give it a shot, and see how would it compare. Of course, at first it wouldn't even compile on my VM, but after a few days, I finally got it working.

And how fast was it? I couldn't even know, it took so long that I never saw it finish (definitely over 30min).

Damn, it was **at least 15x slower** than [my x86 emulator][x86-emulator], written in JavaScript itself!

## Optimisations

Ok, so enough with history time... I'll mention 3 key areas I worked on optimising:

* Scope lookup
* Interpreter loop
* Function calls

These cover pretty much all the time spent in a simple program such as `fib(40)`. I never had any issues with parsing, despite having bits of the parser I know are *far* from optimal.

## Scope lookup

First of all, by scope lookup I mean all the time spent on generating scopes, deleting scopes, and actually looking values up in the scope.

The scope is (TL;DR) where the variables are stored: You start with the global scope, and every function introduces a new scope, i.e. the variables defined inside the function can't be accessed out of it.

```javascript
// global scope
(function () {
  // scope a
  (function () {
    // scope b
  })
})
```

Verve has always had [lexical scoping]:

```javascript
var a = 2;
var plusA = (function () {
 var a = 10;
 return function(b) { return b + a; }
})();
plusA(5) // 15
```

Here the function `plusA` can access `a`, even though it's declared in its parent scope, rather than in its body. And when the function is called, it still looks up the scope where it was defined, rather than where it was called from. This means that functions have to keep track of their enclosing scope.

My initial implementation was, again, the simplest I could think about: A `Closure` was an object that would hold a pointer to a `Scope`, and the `Scope` was a linked list so you could look for a variable up through the scope chain.

```javascript
// pseudocode

class Closure {
  scope: Scope,
  fn: Function
}

class Scope {
  parentScope: Scope,
  values: Map<String, Value>,

  get(key) { values.get(key) || parentScope.get(key) }
}
```

In order to deal with the case where a `Closure` lives longer than its `Scope` (e.g. a `Closure` that returns a `Closure`), I wrapped it in C++ shared pointers: the `Scope` remains alive as long as there's anything pointing to it. Three things could be pointing to a scope:

* It could be the scope for the code the VM was currently executing
* It could be a parent of the scope mentioned above
* A `Closure` could be holding onto it.

## Optimising the Scope

The first optimisation follows my favorite motto: Nothing is faster than doing nothing.

We only need this whole Scope thing if the function actually uses it! During parsing we can analyse all the variables used in the function, and if it doesn't reference anything from the parent scope, we don't need to keep track of the enclosing scope at all.

This saves creating new scopes on every function invocation, but it doesn't speed up lookups in the scope: `fib(40)` is recursive, and for every invocation of `fib(n)` we'll look `fib` up twice, one for `fib(n-1)` and one for `fib(n-2)`.

In order to speed up the lookups, I worked on a few optimisations:

* `std::shared_ptr` wasn't fast enough. It was just way more robust than what I needed... Since it was only used in a few places, replacing it with a simple `refCount` field and doing manual reference counting worked just as well and was much faster. [commit][drop-shared-ptr]
* `std::unordered_map` wasn't fast enough. Same thing. Most of the scopes hold very few values for my small programs, replacing the std implementation with a simple hash map built with a single small array and quick hashing by just using the least significant bits of the pointer was way faster. *(part of the commit above)*
* Going to C++ for every lookup was too slow: Once I had optimised the interpreter (read below) going to C++ meant saving the registers state and aligning the stack. Moving the whole lookup into `asm` was faster. [commit][asm-lookup]
* Caching the lookups: Adding a side table as a linear cache of the lookups, combined with the `asm` implementation of the lookup, made it so that cache hits only take *2 instructions*! [commit][side-table-cache]

Ok, that's enough about scopes...

## Interpreter loop

As mentioned above I started with a big switch statement in C++, but I already knew I wanted to write the interpreter in Assembly. Some people don't agree, but I find it quite fun!

Going to assembly has many benefits that can lead to massive performance wins, for example:

* Fine-grained control over the stack layout: no need for keeping a virtual stack in C++!
* Control over registers: Writing platform specific assembly means that I can use every single callee-saved register to keep around the data I constantly need to access.

I considered two options when I was writing the interpreter:

1. JSC's model: At the end of every opcode implementation, we check what is the next opcode and jump to its implementation.
2. "Traditional model": Still have a central loop, but optimise it by hand in assembly.

I started with JSC's model, since it was what inspired me to write the VM in the first place, but there were a few downsides raised by others I talked to:

* It makes the bytecode big - you need the opcodes to be the address of their actual implementation, which means that you need word-size instructions
* It messes up branch prediction: at the end of every opcode you jump to a random address taken from a random location in the heap.

Upon hearing that, I thought I'd try switching to the traditional model and see whether it was actually faster.

The loop would start by using the next opcode's value to calculate the offset into a list of jumps that would follow. But that was not really efficient, since it'd take the pointer arithmetic + two jumps to get to the desired opcode. [source code][initial-traditional-asm]

My next step was disassembling a switch and looking at how the compiler implemented jump tables, and it was much better than my code: Instead of a list of jumps, you put the relative addresses of the opcodes after the loop, use the value of the opcode to read the right address, and add that to current instruction pointer to get the absolute address of the function. [source code][traditional-jump-table]

I kept on battling, with some smaller optimisations (even though quite effective sometimes), such as [reordering methods based on "hotness"][hot-cold-order] and [refactoring to remove some expensive instructions][pushf-popf], but it still wasn't fast enough...

In a desperate attempt I tried to [rollback to the JSC-style interpreter][back-to-jsc], and to my surprise it was **much** faster. Of course I didn't just throw away all the optimisations I worked on while using the traditional loop implementation, but switching back was what pushed the interpreter from being about as fast as JSC, to being faster.

## Fast closures

`fib(40)` is nothing more than just calling the same function over and over again, *billions* of times. It'd be great if function calls were fast!

In my naive implementation, every function implemented in Verve would be represented in memory by the Closure object I mentioned above, that has a reference to the Function implementation and another to it's enclosing scope. When you make a call, we lookup in the scope for the callee, check whether it's a closure, and if so, we jump to C++ so it can "prepare the closure".

Preparing the closure means: checking whether it needs a new scope, and finding the implementation's offset in the bytecode.

But, if we can figure out at parsing time whether a closure accesses its parent scope, we can make so that functions that don't only have their implementation offset it the bytecode.

The idea of fast closures is exactly that: a tagged pointer which only contains the offset of the function. For memory alignment reasons, some of the least significant bits of a valid pointer will always be zero, so we set the least significant bit to one in order to indicate that it's not an actual pointer, and right next to it we add the functions offset in the bytecode, shifted to left by one.

*Real closure:* 0x00FFF13320<br/>
*Fast closure:* 0x0000000321 *// the address is 0x0190 (0x0321 >> 1)*

<small>*note: As I wrote the previous paragraph I realised there's a bug: fast closures should also not contain nested closures, otherwise the parent scope will be polluted. The type checker should catch it nonetheless, you could bypass it, but, well...*</small>

## Benchmarking

Given the following implementation of `fib` in Verve

```rust
fn fib(n: int) -> int {
  if (n < 2) n
  else fib(n - 1) + fib(n - 2)
}

print(fib(40))
```

And the following implementation in JavaScript

```javascript
function fib(n) {
  return n < 2
    ? n
    : fib(n - 1) + fib(n - 2)
}

print(fib(40))
```

Verve, on [this commit\*][test-commit], takes `8.247s` on an *avg of 5 runs*.

JSC, version *602.1.50*, with `JSC_useJIT=0` takes `14.558s` on an *avg of 5 runs*.

Both were tested on an Early-2016 MacBook running macOS 10.12.

*`*` This commit was picked as I stopped working on perf ever since. Lately I've been having more fun with making it a better language, with proper type checking instead.*

## Conclusion

Optimising things can be fun, but be mindful when optimising real world projects. Most of the time optimisations are about trading readability and mantainability for speed, which doesn't always pay off.

All the optimisations mentioned here weren't picked at random, even though it's a side project, everything was carefully profiled and optimised, before and *after* optimising - things don't always go as you expected.

Other than that, I don't mean to prove anthing - this is not a real benchmark, and there's no way of comparing the Verve VM in its current state to any full-featured VM... I just wrote the post for the same reason I wrote the code: for fun, and hoping it might be helpful, or at least give some inspiration, for someone at some point.

Thanks for reading! :)

[hot-cold-order]: https://github.com/tadeuzagallo/verve-lang/commit/df387375010af7b2e834c5bfc04b0dc8e168892a
[pushf-popf]: https://github.com/tadeuzagallo/verve-lang/commit/69d38b87dd55a2ba4425421b72cd3488edfb0543
[back-to-jsc]: https://github.com/tadeuzagallo/verve-lang/commit/2cb7913d062f7ae4c2d981310b05ec63a95de0c6
[initial-interpreter]: https://github.com/tadeuzagallo/verve-lang/blob/ded677d442184b8b784dce354884d81fc807a772/compiler/vm.cc#L72
[fast-closures]: https://github.com/tadeuzagallo/verve-lang/commit/5ad1ec8f086063094c97fc2c87016596dbb5094d
[test-commit]: https://github.com/tadeuzagallo/verve-lang/commit/5f735b28221542a70af676d832abb1cb68015ad5
[lexical scoping]: https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping
[initial-traditional-asm]: https://github.com/tadeuzagallo/verve-lang/commit/1e4989ccf6d76a13c888a122be8c9b1f79ce99e3
[traditional-jump-table]: https://github.com/tadeuzagallo/verve-lang/commit/f74b753b5c0ae67c5acb0f2a4036f36ca87a7421
[Verve]: https://github.com/tadeuzagallo/verve-lang
[JavaScriptCore]: http://trac.webkit.org/wiki/JavaScriptCore
[x86-emulator]: http://tadeuzagallo.com/blog/writing-an-x86-emulator-in-javascript/
[drop-shared-ptr]: https://github.com/tadeuzagallo/verve-lang/commit/c7ac75cd3858d859c681b79c57f8d43f02b164b0
[asm-lookup]: https://github.com/tadeuzagallo/verve-lang/commit/055e3f7cbd890b847dc640fedb44969f4279d2fd
[side-table-cache]: https://github.com/tadeuzagallo/verve-lang/commit/c4e9a3e0166ac4ac4da2dd562a380a9e720b2fe4
