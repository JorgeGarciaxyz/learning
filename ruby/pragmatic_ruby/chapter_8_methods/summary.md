# More about methods

## Methods definition

### ! methods
Dangerous methods aka: the ones that modify their receiver may be named with ! exclamation mark.

### = methods
Methods that can appear on the left side of an assignment end with an equal sign

ex:
```ruby
def meep=(val)
  @meep = val
end

obj.meep = "hey"
```

### default arguments

You can reference a previous argument

```ruby
def example(word, pad_width=word.length/2)
end
```

## Variable-Length Argument Lists

### Splat operator
Capture multiple arguments into a single parameter (wrapped in an array)

```ruby
def varargs(arg1, *rest)
  "arg1=#{arg1}. rest=#{rest.inspect}"
end

# varargs("one")                 => arg1=one. rest=[]
# varargs("one", "two", "three") => arg1=one. rest=["two", "three"]
```

Sometimes splat its used to specify arguments that are not used by the method but are perhaps used by the corresponding method in a superclass.

```ruby
class Child < Parent
  def do_something(*)
    # our processing
    super
  end
end
```

- You can only have one splat argument by method
- You can't put arguments with default values after the splat operator

### Methods and blocks

If the last parameter in a method definition is prefixed with an ampersand, any block is converted to a Proc object and assigned to the parameter to use the block later.

```ruby
class TaxCalculator
  def initialize(name, &block)
    @name, @block = name, block
  end

  def get_tax(amount)
    "#@name on #{amount} = #{ @block.call(amount) }"
  end
end

tc = TaxCalculator.new("Sales tax") { |amt| amt * 0.075 }
tc.get_tax(100) # => "Sales tax on 100 = 7.5"
```
