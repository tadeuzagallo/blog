---
layout: post
title: "Pretty Typing"
date: 2017-05-25 21:38:14
description: Pretty-printing meets type inference
path: /pretty-typing/
category:
- programming-languages
- fp
twitter_text: "Pretty Typing: Pretty-printing meets type inference"
---

Today I was reading [this great post on the Rust blog][1] about the ergonomics initiative by the Rust language team. It includes a great discussion around "implicit vs explicit", and some ideas for finding the right balance so that a language is not too verbose and yet it’s easy to understand for people reading the code.

I really enjoyed the post, and it got me thinking: the code I’d like to write is not necessarily the same code I’d like to read.

### Pretty-printing

Enforcing a consistent coding style can be seen to have similar trade-offs: when you’re writing code or (more critically) moving code around you don’t want to be slowed down by manually formatting your code so that it looks nice, but it’s also terrible to review code that’s poorly formatted or to work on a codebase that doesn’t have a consistent coding style.

It is a similar dilemma: should you optimise for the writer and just let them format their code however is more productive for them **or** should you optimise for the people who are reading the code and have a consistent style?

Many people would argue for the latter, as in most cases the code written by a single person will be read by more than one person. However, smart formatters such as [gofmt][3], [refmt][4] and [prettier][5] have had great success by automating this process out of the users way, showing that this might be a false dichotomy.

<!--### Pretty-typing-->


### Pretty-*typing*

Maybe we could apply similar ideas to other areas of coding, such as type inference?

When you start working on a project or a feature you build a mental model of it as you go, and so you require little to no context about the code you’re working on. As soon as you page out that code from your mind, or when someone else looks at your code, that is no longer true though.

Extrapolating a little bit, consider Google Docs as an example: You have an “editing mode” for when you are writing, a “suggesting mode” for when you are reviewing a document and a “viewing mode” for when you’re just reading it. All this modes are slightly different, optimised for the task at hand.

**What if we had an "editing mode" and a "viewing mode" for coding?**

<!--Compilers can be quite smart, and they do know a lot about your program, which means that they can infer many things that we'd otherwise have to type, but whoever reads that code afterwards will have to do the same job as the compiler to understand everything that is implicit.-->

When writing code you could benefit from everything the compiler knows about your program: if something can be inferred, you should not be *required* to type it.

On the other hand, working on other people’s code is known to be challenging, specially when you’re new to a codebase. This could be eased by adding extra information known to the compiler right next to the code, more specifically consistent type annotations.

<!--But what if what you type wasn’t necessarily what your coworkers are going to read? You could just use all the knowledge the compiler has about your code, and in the end we could just "pretty-type" it, optimising for readability.-->

<!--Sure, you could argue that good IDE support comes close to that, as it allows you to query the types of any expressions and jump through code, but not just that requires interaction with IDE restricts what users can use to write programs in your language.-->
Sure, you can already achieve some of it with a good IDE today: it allows you to query the type of any expression, jump through code, define snippets and etc. The problem I see with that is not just that it requires an extra step to interact with the IDE, but anyone who's favourite environment is not supported will have to make a choice: either you switch to a supported environment or you take a productivity hit.

### Example

Here’s what I imagine it could look like in [Verve][2], my personal language project. You start prototyping your program, and you don’t want to spend too much time writing types, so you take full advantage of type inference.

```
fn map(fn, list) {
  match list {
    case [x, ...rest]: [fn(x), ...map(fn, rest)],
    case []: [],
  }
}
```

And once you pretty-print your program it could look like the following.

```
/// maybe include a header doc template if it's part of the public API?
fn map<T, U>(fn: (T) -> U, list: List<T>) -> List<U> {
  match list {
    case [x, ...rest]: [fn(x), ...map(fn, rest)],
    case []: [],
  }
}
```

This way other people's productivity is not affected by the fact that you took full advantage of type inference. They have the full type of the function right next to it regardless of whether you typed it or not.

### Further advantages

Another thing that jumped to mind was that it ensures whoever modifies this code next will have clear feedback of how their changes affect the API.

For example, if you decided to do some print-debug in the untyped `map` function above, such as:

```
fn map(fn, list) {
  match list {
    case [x, ...rest]:
      print_string(x)
      [fn(x), ...map(fn, rest)],
    case []: [],
  }
}
```

This would cause `list` to have an inferred type of `List<String>` instead of a generic list. To make things worse, this will fail not within `map`, but later on based on types inferred by calls to `map` (it might unify some other type with`List<String>` and fail in a seemingly unrelated part of the codebase).

Sure, you could add explicit types to `map` in order to prevent it, but that invalidates the whole point of this post. Additionally, if you just typed this function and have full context of what the program is doing, that might be tolerable, but if you're just getting started in the codebase I believe this could be frustrating.

This is purely based on my personal experience: when this happens to me I mostly end up manually writing the types to get a better understanding of where things went wrong, hence why I believe this could be helpful.


### Conclusion

Functional languages such as OCaml and Haskell already have great type inference and support explicit type annotations, but it’s still up to the programmer to manually write the type annotations. It would be great if we could take it a step further and do for type inference (and maybe more than types?) what formatters did for coding style.

As a final remark, nothing that I mentioned here has actually been implemented in Verve yet, but I thought I’d write it down anyway, so maybe someone can stop me in time if it’s a bad idea.

Thanks for reading! 😀


[1]: https://blog.rust-lang.org/2017/03/02/lang-ergonomics.html
[2]: https://tadeuzagallo.com/blog/introducing-verve/
[3]: https://blog.golang.org/go-fmt-your-code
[4]: https://facebook.github.io/reason/tools.html#tools-command-line-utilities-refmt
[5]: http://jlongster.com/A-Prettier-Formatter
