# Chapter 4 Containers, blocks and iterators

Short summary of things I learn

### Block local variables

```ruby
square = "some shape"
sum = 0
[1, 2, 3, 4].each do |value; square|
    square = value * value
    # this is a different variable
    sum
    += square
end

puts sum # > 30
puts square # > some shape
```

### Use parameter on yield

```ruby
def meep(arg)
  yield arg
end

meep(1) { |arg| puts arg }
```

The yield can return a value to the block where's executed

```ruby
class Array
  def find
    each do |value|
      return value if yield(value)
    end
    nil
  end
end

arr.find { |v| v*v > 30 } # > 7
```

