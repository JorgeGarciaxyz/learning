# Chapter 17 Character encoding

## 17.1 Encodings

The ruby class who manage this is the `Encoding` class. Objects of this class represents
a different character encoding. The `Encoding.list` method returns a list of built-in
encodings and the `Encoding.aliases` returns a hash where the keys are aliases and the
values are the corresponding base encoding.
We can use these two methods to build a table of known encoding names:
```ruby
encodings = Encoding
              .list
              .each_with_object({}) do |enc, full_list|
                full_list[enc.name] = [enc.name]
              end

Encoding.aliases.each do |alias_name, base_name|
  fail "#{base_name} #{alias_name}" unless encodings[base_name]
  encodings[base_name] << alias_name
end
```

## 17.2 Source files

There's a simple rule, if you only use 7-bit ASCII in your source the encoding is
irrelevant. The simplest way to write Ruby source files that just work is to stick with
it.

If your source files are not written using 7-bit ASCII you need to tell Ruby about it.
Ruby uses a magic comment:
`# coding: utf-8`

As Ruby is just scanning for coding you could also write the following.
```
# encoding: ascii
```

If there's a shebang line (#!) the encoding comment must be the second line of the file:
```
#!/usr/local/rubybook/bin/ruby
# encoding: utf-8
```

### Ruby 1.9 vs Ruby 2.0

In Ruby 1.9 the default source file encoding is US-ASCII. If your source files contain
any characters with byte value greater than 127, you'll need to tell Ruby the encoding
of the file.
You'll get an error unless you add the enconding `utf-8` at the top.

Ruby 2.0 uses UTF-8 as default.

### Source elements that have encodings

String literals are always encoded using the encoding of the source file that contains
them, regardless of the content of the string.

Symbols and regular expression literals that contain only 7-bit characters are encoded
using US-ASCII. Otherwise, they will have the encoding of the file that contains them.

You can create arbitrary Unicode characters in strings and regular expressions using the
\u escape. This has two forms \uxxxx lets you encode a character using four hex digits,
and the delimited form `\u{x... x.... x...}` lets you specify a variable numbers of
characters each with a variable number of hex digits:

```ruby
"Greek pi: \u03c0"          # => "Greek pi: π"
"Greek pi: \u{3c0}"         # => "Greek pi: π"
"Greek \u{70 69 3a 20 3c0}" # => "Greek pi: π"
```

Literals containing a \u sequence will always be encoded UTF-8, regardless of the source
file encoding.

The String#bytes method is a convenient way to inspect the bytes in a string object.
