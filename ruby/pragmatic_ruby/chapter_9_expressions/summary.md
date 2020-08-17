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

## defined?

Returns nil if its argument is not defined. It will returns a description of that argument otherwise.

## Comparing objects

For the negated methods, first ruby will loke for these methods; if not found, will then invoke the negated method and negating the result.

```
== equal value
=== Compare each of the items with the target in the when clause of a case statement
<=> General comparison operator. Return -1, 0 or +1 depending if the receiver is less than, equal to or greater than its argument
<, <=, >=, >
=~ Regular expression pattern match
eql? True if the receiver and argument have both same type and equal values
qual? True if the receiver and argument have the same object ID
```

## Case statements

There is two ways to use case

1
```ruby
case
  when song.name == "Misty"
  ...
end
```

2
```ruby
case command
  when "debug"
    ...
  when "meep"
    ...
end
```

You can also assign the result to a variable (like ifs statements)

The test of each case statement is done using comparison `===` target.
The operator is defined in class `Class`.

# Loops

## While
Executes as long as its condition is true.

## Until

Is the opposite, executes the body until the condition becomes true.

If the statement they are modifying (while) is a begin ... end block, the code in the block will always execute at least one time, regardless of the value of the boolean expression


# Iterators

Ruby doesnt have a for loop, at least not the kind that iterates over a range of numbers.
Instead, Ruby uses methods defined in various built-in classes to provide equivalent but less error prone functionality.

examples:

```ruby
# Traditional for i-0 til 9
0.upto(0) do |x|
  print x
end

# O to 12 by 3
0.step(12, 3) { |x| print x }

# On arrays
[].each...
```

Once a class supports each, the additional methods in the `Enumerable` module become available.

The most basic loop of all, Ruby provides a built-in iterator called loop:

```ruby
loop do
  # block
end
```

The loop iterator calls the associated block forever until you break out of the loop.

As long as you class defines a sensible each method, you can use a for loop to traverse its objects.

```ruby
class Periods
  def each
    yield "Classical"
    yield "Jazz"
    yield "Rock"
  end
end

periods = Periods.new

for genre in periods
  puts genre
end
```

## Brea, redo and next
The loop control constructs break, redo and next, let you alter the normal flow through a loop or iterator.

**break** terminates the enclosing loop
**redo** repeats the current iteration of the loop from the start but without reevaluating the condition or fetching the next element
**next** skips to the end of the loop, starting the next iteration

Break will not return anything unless it is returned `break(line)`

## Variable Scope, Loops, and Blocks

The `while, until and for loops` will not introduce new scope; previously existing locals can be used in the loop and any new locals created will be available afterward.

The scoping rules for blocks (ausch as those used by loop and each) are different.
Normally, the local variables created in these blocks are not accessible outside the block.

```ruby
[].each do { |x| y = x +1 }

[x, y ] # undefined
```

If at the time the block executes a local variable already exists with the same name as that of a variable in the block, the existing local variable will be used in the block.
Its value will therefore be available after the block finishes.
This applies to normal variables in the block but not to the block parameters.

```ruby
x = "meep"
y = "meep2"
[1, 2].each do |x|
  y = x + 1
end

[x, y]  # => [meep, 4]
```

The variable doesnt have to be executed. The Ruby interpreter just needs to have seen that the variable exists on the left side of an assignment:

```ruby
a = "never used" if false
[99].each do |i|
  a = i
end

a # => 99
```

You can list block-local variables in the blocks parameter list preceded by a semicolon.

```ruby
total = 0
[99].each do |i; meep|
  meep = i
  total = i
end

[meep, total] # => [99, 99]
