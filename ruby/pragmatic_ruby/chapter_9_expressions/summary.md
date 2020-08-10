# Expressions

## Operator Expressions

### Chained append

```ruby
class Meep
  def <<(score)
    @total_score += score
  end
end

scores = Meep.new
scores << 10 << 20 << 40
```

The << method explicitly return self, thats why this allow the method chaining.

## Command Expansion

If you enclose a string in backquotes (backticks) or use the delimited form prefixed by %x, it will be executed as a command by your operating system.
THe value of the expression is the standard output of that command. Newlines will not be stripped.

```ruby
`date` # => Sun 09 Aug 2020 08:19:17 PM CDT
```

## Assignment

An assignment sets the variable on its left sife to refer to the value on the right.
Then returns that rvalue as the result of the expression this you can chain assignments.

```ruby
a = b = 1 + 2 + 3
a # => 6
b # => 6

a = (b = 1 + 2) + 3
a # => 6
b # => 3
```