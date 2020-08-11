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

Since Ruby 1.8, the value of the assignment is always the value of the parameter. The return value of the method is discarded.

If the left ide contains a single element and the rvalues are many, the array is assigned to lvalue

```ruby
a = 1, 2, 3, 4 # a=[1,2,3,4]
```

If the lhs contains a comma, Ruby matches values on the rhs against successive elements on the lhs. Excess elements are discarded.

```ruby
a, b = 1, 2, 3, 4 # a=1, b=2
```

## Splats and Assignment

If there is any splat on the right side of an assignment, each will be expanded inline into its constituen values during the evaluation of the rvalued and before the assignment to lvalues starts.

```ruby
a, b, c, d, e = *(1..2), 3, *[4, 5] # a=1, b=2, c=3, d=4, e=5
```

Only one lvalue may be a splat.

If the splat is the last value, it will soak any rvalues that are left after previous assignments.

```ruby
a, *b = 1, 2, 3 # a=1, b=[2,3]
```

If the splat is not the last value, then will ensure that the lvalues that follow it will all receive values from rvalues at the end of the right side.

```ruby
*a, b = 1, 2, 3, 4 # a=[1, 2, 3], b=4

f, *g, h, i, j = 1, 2, 3, 4 # f=1, g=[], h=2, i=3, j=4
```

As with method parameters, you can use raw asterisk to ignore rvalues.

```ruby
first, *, last = 1, 2, 3, 4, 5 # first=1, last=5
```

## Nested assignments

The left side of an assignment may contain a parenthesized list of terms. Ruby treats these terms as if they were a nested assignment statement. It extracts the corresponding rvalue, assigning it to the parenthesized term.

```ruby
a, (b, c), d = 1, 2, 3, 4   #    a=1, b=2, c=nil, d=3
a, (b, c), d = [1, 2, 3, 4] #  a=1, b=2, c=nil, d=3
a, (b, c), d = 1, [2, 3], 4 #  a=1, b=2, c=3, d=4
```

## Other assignments

You can use syntactic shortcuts `a = a +2` == `a += 2`

Youy cant use auto increments of java and C `i++` you may use `+=` and `-=`

# Conditionals

## And, or and not

The only difference between or and || is their precedence, `and` and `or` have the same precedence but && has a higher precedence than ||


