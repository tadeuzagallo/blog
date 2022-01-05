---
lang: en
title: "Introducing Verve"
date: 2016-07-08 17:03:12
description: An experimental, minimalistic, static, functional language with zero dependencies.
slug: introducing-verve
image: 'images/verve-logo.jpg'
category:
- verve
- fp
- interpreter
twitter_text: "Introducing Verve: An experimental, minimalistic, functional language with zero dependencies"
---

I make no secret that I have been working on a programming language for quite a while, and now that I found a name for it, I can finally make it open source!

## But first of all, why am I writing this language?

The short answer is: For fun.

The long answer is that I've been interested in compilers for a while, but I have always needed to put things in practice in order to properly understand them, and this is my playground where I can try all the cool stuff that I did and will learn about programming language and compiler design.

As a result, everything in [Verve] is written from scratch, it has zero dependencies and I plan to keep it like that. One of the first things I usually hear is "Why don't you target [LLVM]?" (or some other runtime), and the answer is: because that wouldn't be as much fun. Sure, it'd be much easier to get "production ready" that way, but as I said, the goal here is really to learn and have fun.

## What does it look like?

My goals for [Verve] as a language are not really novel: creating a more approachable functional language. There are concepts and syntax borrowed from many other languages, both major and minor, functional and object-oriented, and although Verve is fully functional, the idea is to keep a certain balance amongst these concepts in order to create a nice and approachable language.

The basic syntax for function declaration and invocation might (incidentally) resemble [Rust]:

```rust
fn fib(n: int) -> int {
  if (n < 2) n
  else fib(n - 1) + fib(n - 2)
}

print(fib(4))
```

Here the `fn` keyword indicates it's a function declaration, and every function must have explicit types for its parameters and return type. Everything in Verve is an expression, which means that you can do things like assign an `if` expression to a variable.

Additionally, there's no support for explicit returns, the return value of a function is the result of the last expression in its body.

The semantics and syntax for function calls pretty much match every C-style languages: you must pass the right number of arguments, of the right type, separated by commas and in between parenthesis.

Verve has [Algebraic Data Types][ADT] (ADT) and pattern matching:

```rust
type list<t> {
  Nil()
  Cons(t, list<t>)
}
```

Here we define the recursive type `list`, that takes the type variable `t`, which represents what type this list will contain. The `list` type has two type constructors (which *construct* instances of a type), `Nil` and `Cons`.

Once you have constructed a type, the only way to extract its contents is to pattern `match` it:

```rust
fn print_list(l: list<printable>) -> void {
  match l {
    Nil() => {}
    Cons(x, rest) => {
      print(x)
      print_list(rest)
    }
  }
}
```

(you can also use pattern match with `let` expressions)

[Verve] also has type `interfaces` and `implementations`, which semantically are pretty similar to [Haskell]'s type classes and instances:

```rust
interface show<t> {
  virtual show(t) -> string
}

implementation show<string> {
  fn show(s) { s }
}
```

The `interface` takes a type variable, representing any type that will implement this interface, and can declare both `virtual` and concrete functions. For `virtual` functions you only need to specify the signature, and it *must* be overridden  on every `implementation`.  Concrete functions are declared as common functions, with types and a body, and *may* be overridden on any `implementation`.

Another characteristic of [Verve] is that, even though you can't write any side effects with the language's semantics, you can still write a function with side effects in C/C++ and `extern` it. Like print:

```rust
extern print (printable) -> void
```

It takes a value of any type that implements the interface `printable` and returns `void`, but it's implementation in C++ writes to the standard output, which is a side effect of the function invocation.

This are the base concepts of the language, next I'll talk a little bit about how and why it's implemented the way it is.

## The implementation

Right now [Verve] runs on its own [Virtual Machine][VM] (VM), which is something that is no longer necessary: When I started what became the current implementation, I didn't really want to write a language, I just wanted to write a VM, but I needed something to run on it and I was too lazy to write a proper parser, so I just started off with some very basic lisp.

As I worked on the VM, I started using the language for tests and sample code, and I didn't really like it, so I started spending more time in making it a better language than on the VM itself, and now I have a statically typed language, where we can know all the types at compile time, and for which it should be rather straightforward to generate machine code ahead of time given that we already generate bytecode.

I'll talk briefly about 5 pieces of the implementation: Parser, Type checker, Bytecode, Interpreter and Garbage Collector.

### Parser

The parser is a handwritten [recursive descent parser][RDP]. The grammar is [LL(1)], and can be found [here][Grammar].

Fun fact about the grammar: I wrote the parser before writing the grammar, and started running into many issues, then decided to sit down and write the formal grammar, and found many bugs on the code I had written for the tests.

### Type checker

The type checker is not very sophisticated: since type annotations are mandatory for functions, we only have to [infer][Type Inference] types for local variables, which in turn are immutable.

### Bytecode

Verve's VM is a [stack machine] and has its own bytecode, which is tiny, only 23 opcodes. It was designed for simplicity over efficiency, and I plan on replacing it with a register based bytecode, before actually generating machine code.
 
### Interpreter

The interpreter is probably the part of the VM which I'm most proud of: It's written in [GAS] x86_64, and inspired by [JavaScriptCore][JSC]'s LLInt (Low Level Interpreter), with a few modifications:
Since the code is platform dependant, I can abuse of all x86_64's registers.
When it comes to [inline caching], LLInt's bytecode contains "holes" for variable values, which will later be rewritten into the actual value loaded from the variable. In Verve I opted not to that because it requires modifying the bytecode itself, which will cause memory pages to be copied, and instead I use a side table for storing the values and only add a fixed index into the table to bytecode itself.

### Garbage Collection (GC)

As the opposite of the interpreter, the [GC] is probably the part of the system that received the least love. It just uses the C++ heap and keeps track of allocations' address and size in a separate structure. When a garbage collection is triggered, the collector stops the world and scans the stack conservatively and the heap precisely, then eagerly sweeps everything in one pass.

These are the basics of how the key parts of the current implementation work, but as you'll see next, it might change soon.

## What Next?

The next major goal is making the language [self-hosting] (i.e. write the Verve compiler in Verve itself), and that depends on several smaller things, such as converting bytecode/[IR] to be register based, getting rid of the interpreter and replacing it with an [AOT] compiler, and definitely minor improvements of the language, such as adding more [syntactic sugar] and making pattern matching more powerful than it currently is.

---

I hope you enjoyed the post, and if you think you'd have fun with [Verve] as well, either playing with the language or the implementation, the code can be found at [github.com/tadeuzagallo/verve-lang][Verve]

<small>*As usual I try to keep links to every possible acronym and term that I think could be new for **anyone** reading the post, but of course I might have forgotten some. So if you had to google for any of the terms in the text, please let me know and I'll add a reference to it. Thanks!*</small>

[Verve]: https://github.com/tadeuzagallo/verve-lang
[Rust]: https://www.rust-lang.org
[Haskell]: https://www.haskell.org/tutorial/classes.html
[ADT]: https://en.wikipedia.org/wiki/Algebraic_data_type
[Grammar]: https://github.com/tadeuzagallo/verve-lang/blob/master/resources/grammar.ebnf
[JSC]: http://trac.webkit.org/wiki/JavaScriptCore
[GC]: https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)
[VM]: https://en.wikipedia.org/wiki/Virtual_machine
[LL(1)]: https://en.wikipedia.org/wiki/LL_grammar
[RDP]: https://en.wikipedia.org/wiki/Recursive_descent_parser
[Type Inference]: https://en.wikipedia.org/wiki/Type_inference
[stack machine]: https://en.wikipedia.org/wiki/Stack_machine
[GAS]: https://en.wikipedia.org/wiki/GNU_Assembler
[self-hosting]: https://en.wikipedia.org/wiki/Self-hosting
[IR]: https://en.wikipedia.org/wiki/Intermediate_representation
[syntactic sugar]: https://en.wikipedia.org/wiki/Syntactic_sugar
[AOT]: https://en.wikipedia.org/wiki/Ahead-of-time_compilation
[LLVM]: http://llvm.org
[inline caching]: https://en.wikipedia.org/wiki/Inline_caching
