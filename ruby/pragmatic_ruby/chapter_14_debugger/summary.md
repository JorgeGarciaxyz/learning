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

