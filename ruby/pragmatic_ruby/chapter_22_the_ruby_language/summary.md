# Chapter 22 the Ruby language

## 22.2 Source layout

Ruby expressions and statements are terminated at the end of a line unless the parser can
determinte that the statement is incomplete such as if the last token on a line is an
operator or comma.
A semicolon can be used to separate multiple expressions on a line.
You can also put a backslash at the end of a line to continue it onto the next.

```ruby
e = 8 + 9 \
    + 10
```

A program may include multiple BEGIN and END blocks. BEGIN blocks are executed in the
order they are encountered. END blocks are executed in reverse order.

### General Delimited Input

As well as the normal quoting mechanism, alternative forms of literal strings, arrays of
strings and symbols, regular expressions, and shell commands are specified using a gener-
alized delimited syntax.

https://www.linuxtopia.org/online_books/programming_books/ruby_tutorial/The_Ruby_Language_General_Delimited_Input.html

like:
- %q single-quoted strings
- %i array of symbols
- etc

Unlike their lowercase counterparts, %I , %Q , and %W will preform interpolation:
```ruby
%I{ one digit#{1+1} three}
```

## 22.3 Basic types

### Integers and floating-point

Ruby integers are objects of class Fixnum or Bignum . Fixnum objects hold integers that fit
within the native machine word minus 1 bit. Whenever a Fixnum exceeds this range, it is
automatically converted to a Bignum object, whose range is effectively limited only by available
memory. If an operation with a Bignum result has a final value that will fit in a Fixnum , the
result will be returned as a Fixnum .

Integers are written using an optional leading sign and an optional base indicator ( 0 or 0o
for octal, 0d for decimal, 0x for hex, or 0b for binary), followed by a string of digits in the
appropriate base. Underscore characters are ignored in the digit string.

```ruby
0d123456 # fixnum
123_456 # 123456 fixnum underscore ignores
0xaabb  # 43707 fixnum hexadecimal
0o377   # 255 octal
-0b10_1010 # -42 fixnum binary negated
```

A numeric literal with a decimal point and/or an exponent is turned into a Float object, corre-
sponding to the native architecture’s double data type. You must follow the decimal point
with a digit; if you write 1.e3 , Ruby tries to invoke the method e3 on the Fixnum 1. You must
place at least one digit before the decimal point.

### Strings

Single-quoted string literals ( 'stuff' and %q/stuff/ ) undergo the least substitution. Both convert
the sequence \\ into a single backslash, and a backslash can be used to escape the single quote
or the string delimiter. All other backslashes appear literally in the string.

Last, and probably least (in terms of usage), you can get the string corresponding to an ASCII
character by preceding that character with a question mark.

Strings can continue across multiple input lines, in which case they will contain newline
characters. You can use here documents to express long string literals.

### Ranges

Outside the context of a conditional expression, expr..expr and expr...expr construct Range
objects. The two-dot form is an inclusive range; the one with three dots is a range that excludes
its last element.

### Arrays

Arrays of strings can be constructed using the shortcut notations %w and %W . The lowercase
form extracts space-separated tokens into successive elements of the array. No substitution
is performed on the individual strings. The uppercase version also converts the words to an
array but performs all the normal double-quoted string substitutions on each individual
word.

### Hashes

If you keep an external reference to an object that is used as a key and use that reference to
alter the object, thus changing its hash code, the hash lookup based on that key may not
work. You can force the hash to be reindexed by calling its rehash method.

Because strings are the most frequently used keys and because string contents are often
changed, Ruby treats string keys specially. If you use a String object as a hash key, the hash
will duplicate the string internally and will use that copy as its key. The copy will be frozen.
Any changes made to the original string will not affect the hash.

If you write your own classes and use instances of them as hash keys, you need to make sure
that either (a) the hashes of the key objects don’t change once the objects have been created
or (b) you remember to call the Hash#rehash method to reindex the hash whenever a key hash
is changed.

## 22.4 Names

### Variable/Method Ambiguity

When Ruby sees a name such as a in an expression, it needs to determine whether it is a
local variable reference or a call to a method with no parameters. To decide which is the
case, Ruby uses a heuristic. As Ruby parses a source file, it keeps track of symbols that have
been assigned to. It assumes that these symbols are variables. When it subsequently comes
across a symbol that could be a variable or a method call, it checks to see whether it has seen
a prior assignment to that symbol. If so, it treats the symbol as a variable; otherwise, it treats
it as a method call.

## 22.5 Variables and Constants

Ruby variables and constants hold references to objects.
The type of a variable is defined by the messages to which the object referenced by the
variable responds.

A Ruby `constant` is also a reference to an object. Constants are created when they are
first assigned to. You can alter the value of the constant but you'll get a warning.

Note that although constants should not be changed, you can alter the internal states of the
objects they reference (you can freeze objects to prevent this). This is because assignment
potentially aliases objects, creating two references to the same object.

### Scope of constants and variables

Outside the class or module the constants may be accessed using the `scope` operator `::`
prefixed by an expression that returns the appropiate class or module object.
Constants may not be defined in methods.

**global variables**
Global variables are available throughout a program. Every reference to a particular global
name returns the same object. Referencing an uninitialized global variable returns nil .

**class variables**
are available throughout a class or module body. Class variables must be ini-
tialized before use. A class variable is shared among all instances of a class and is available
within the class itself.

```ruby
class Song
  @@count = 0
end
```

Class variables belong to the innermost enclosing class or module. Class variables used at
the top level are defined in Object and behave like global variables.
