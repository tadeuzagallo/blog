---
layout: post
title: "Writing a λ-calculus interpreter (part 2)"
date: 2017-01-01 20:38:14
description: adding values
path: /lambda-calculus-interpreter-in-javascript-part-2/
category:
- interpreter
- fp
- javascript
twitter_text: "A λ-calculus interpreter in less than 200 lines of JavaScript"
hide: true
---

I have been meaning to follow up on [my lambda calculus post] for a while and could never find time, but thankfully someone left a comment in the post which reminded me, and I thought it'd be nice to start the year with a new post! :)

The follow up I had in mind initially was to extend the previous implementation with static types, then changed to extending it with type inference. Either way, to make it more interesting (and the language more expressive), I thought it'd be nice to add a few simpler extensions first.

## Extensions

I'll go over extending the previous implementation of the lambda calculus with booleans and numbers. I'll also cover adding if expressions, to consume the boolean values, and top-level assignments, as syntactic sugar for defining variables [TODO].

In order to make the language extensions really useful, we'd also need operators, both to manipulate numbers, and to produce dynamic boolean values, but I'll leave that as an exercise to the reader.

### Grammar

First we augment the grammar with the new constructs:

```bnf
Program ::= Declaration SEMI Program
          | Declaration
          | ε

Declaration ::= LET LCID EQ Term
              | Term

Term ::= Application
       | LAMBDA LCID DOT Term

Application ::= Application Atom
              | Atom

Atom ::= If
       | Literal
       | LCID
       | LPAREN Term RPAREN

If ::= IF Term THEN Term
     | IF Term THEN Term ELSE Term

Literal ::= BOOLEAN_LITERAL
          | NUMERIC_LITERAL

* What's new:
* non-terminals: Program, Declaration, If and Literal
* terminals: SEMI, LET, EQ, IF, THEN, ELSE, NUMERIC_LITERAL, BOOLEAN_LITERAL.
```

The additions are basically that we now allow top-level declarations,
