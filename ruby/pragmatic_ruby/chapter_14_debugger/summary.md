# Chapter 14 Debugger

## Ruby Debugger

Ruby comes with a debugger included into the base system.
You can run the debugger by invoking the interpreter with the -r debug option.

`ruby -r debug ‹ debug-options › ‹ programfile › ‹ program-arguments ›`

The debugger supports:
- Breakpoints
- step into/over metho calls
- display stack frames and variables

## Editor support

You can run ruby using your editor, for example using vi `:%!ruby` which replaces the
program text with its output or `:w_!ruby` which displays the output without affecting
the buffer.

## But is doesn't work

- Run your scripts with warnings enabled (the -w command-line option)
- An attribute setter is not being called. Within a class definition, Ruby will parse
  setter= as an assignment to a local variable, not as a method call. Use self.setter=
- Objects that don't appear to be properly setup may have been vistims of an incorrectly
  spelled initialize method

```ruby
class Incorrect
  attr_reader :answer

  def initialise
    @answer = 42
  end
end

ultimate = Incorrect.new
ultimate.answer # => nil
```
The same will happen if you misspell the instance variable name.

- The ugly message `syntax error, unexpected $end, expecting keyword_wned` means that you
  have an end missing somewhere in your coed. The $end in the message means end-of-file.
  Try running the code with -w which will warn if find ends that aren't aligned.
- Output written to a terminal may be buffered. You may not see a message you write
  immediately. Also, the order may not appear in the order you were expecting.
- If numbers don't come out right, perhaps they're strings. Text read from a file will be
  string. A call to Integer will work.
- If you're using an object as the key of a hash, make sure it doesn't change its hash
  value or arrange to call `Hash#rehash` if it does
- Use `Ojbect.freeze` if you suspect that some unknown portion of code is setting a
  variable to a bogus value. Try freezing the variable. The culprit will be caught during
  the attemp to modify the variable.

## But It's too slow

### Benchmark

You can use the `Benchmark` module to time sections of code.

The Benchmark module has the `bmbm` method that runs the tests twice, once as a rehearsal
ans oce to measure performance in an attempt o minimize the distortion introduced by the
garbage collection.

### The profiler

Ruby comes with a code profiler. The profiler shows the number of timeas each method in
the program is calles and the average and cumulative time that Ruby spends in those
methods.

You can add profiling to your code using the command-line option -r profile or from
whitin the code using require "profile".

```ruby
count = 0

words = File.open("meep")

while word = word.gets
  word = word.chomp!
  if word.length == 12
    count += 1
  end
end

puts "#{count} twelve-character words"
```

If we call this with the profile the profiler will give us more clues.

We can notive that the program invoked `gets` and `chomp!` it takes a lot of time. We
can improve the performance if we could remove the loop. We can use a pattern to that

```ruby
words = File.read("/usr/share/dict/words")
count = words.scan(/^............\n/).size

puts "#{count} twelve-character words"
```

This is 4 times faster than the old one.

Ruby is a wonderfully transparent and expressive language, but it does not relieve the pro-
grammer of the need to apply common sense: creating unnecessary objects, performing
unneeded work, and creating bloated code will slow down your programs regardless of the
language.
