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

### Implement each_with_index on a string
```ruby
"meep".each_char.with_index { |item, index| ... }
```

### Blocks for Transactions

note:
```ruby
def meep(*args)
  x_meep(*args)
end
```
`*args` meaning “collect the actual parameters passed to the method into an array named args
do not care what args are

Block passed to function on File.open method
```ruby
def self.open(*args)
  result = file = File.new(*args)
  # If there's a block, pass in the file and close the file when it returns
    if block_given?
      result = yield file
      file.close
    end
  result
end
```


