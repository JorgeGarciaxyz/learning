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

### Implicit block

Any method can receive a block

```ruby
def hello
end

hello { puts "meep" }
```

### Explicit block

You can define a method who will explicit receive a block using ampersand

```ruby
def hello(&block)
  yield if block_given?
end

hello do { puts "meep" }
```

or using .call (Proc) method

```ruby
def hello(&hello)
  block.call if block_given?
end

 hello { puts "meep" }
 ```

### Return block

```ruby
def create_block_object(&block)
  block
end

bo = create_block_object { |param| puts "You called me with #{param}" }
bo.call "cat"
bo.call "cat"
```
If the block is returned it will not be executed, you need to execute it using .call method

### Blocks as closures

Definition of closure: function that can be stored as a variable

```ruby
def n_times(thing)
  lambda {|n| thing * n }
end

p1 = n_times(23)
p1.call(3) # => 69
p1.call(4) # => 92
```

> The method n_times returns a Proc object that references the method’s parameter, thing . Even
though that parameter is out of scope by the time the block is called, the parameter remains
accessible to the block. This is called a closure—variables in the surrounding scope that are
referenced in a block remain accessible for the life of that block and the life of any Proc object
created from that block.

### Alternative Notation

You can write lambas on an alternative notation

```ruby
-> params { ... }

proc1 = -> (arg1, arg2) { puts "Meep #{arg1} and #{arg2} " }

proc1.call("meep1", "meep2")
```

### Proc vs block

Procs: are objects 
Block: part of the syntax of method call

### Proc vs lambda

Both are Proc objects

- Lambdas check the number of arguments, procs not
- They handle the return different

```ruby
def lambda_test
  lam = lambda { return }
  lam.call
  puts "Hello world"
end

lambda_test                 # calling lambda_test prints 'Hello World'

def proc_test
  proc = Proc.new { return }
  proc.call
  puts "Hello world"
end

proc_test                 # calling proc_test prints nothing
```