# Chapter 24 Metaprogramming

## 24.1 Objects and Classes

### Self and method calling

`self` controls how ruby finds instance variables. When you access an instance variable,
Ruby looks for it in the object referenced by self.

In ruby each method call is made on some object. This object is called the receiver of
the call.

If you make a method call such as puts "hi" , there’s no explicit receiver. In this case, Ruby
uses the current object, self , as the receiver. It goes to self ’s class and looks up the method (in
this case, puts ). If it can’t find the method in the class, it looks in the class’s superclass and
then in that class’s superclass, stopping when it runs out of superclasses (which will happen
after it has looked in BasicObject

When yoy make a method call with an explicit receiver the process is familiar. The only
chane is the fact that `self` is changed for the duration of the call.
Before starting the method lookup process, Ruby sets self to the receiver (the object
referenced by items in this case). Then, after the call returns, Ruby restores the value
that self had before the call.

### self and Class Definitions

We've seen that calling a method with an explicit receiver changes self, self is also
canges by a class definition. This is a consequence of the fact that class def are
executable code in Ruby, if we can execute code we need to have a current object.

Inside a class definition, self is set to the class object of the class being defined.
This means that instance variables set in a class def will be available to class methods.

```ruby
class Test
  puts "self = #{self}" # Test
  puts "class of self #{self.class}" # Class
end

class Test
  @var = 99
  def self.value_of_bar
    @var
  end
end

Test.value_of_bar # 99
```

## 24.2 Singletons

Ruby lets you define methods that are specific to a particular object. These are called
singleton methods

```ruby
animal = "cat"
puts animal.upcase
```

The animal variable points to an object containing the value of the string cat and a pointer
to the object's class, String.

When we call .upcase ruby goes to the object referenced by the animal variable and then
looks for the method upcase in teh class object.

Lets define a singleton method on the string referenced by animal:

```ruby
animal = "cat"

def animal.speak
  puts "the #{self} says miaow"
end

# produces
# the cat says miaow
```

How ruby finds the method `speak` in the cat if its not defined on the class `String`?

When we defined the singleton method for the "cat" object, Ruby created a new anonymous
class and defined the speak method in that class. This anonoymous class is sometimes
called a singleton class and other time an eigenclass.

Ruby makes this singleton class the class of the cat object and makes `String` the superclass
of the singleton class.

What if we call `animal.upcase`? the process starts the same way, Ruby looks for the method
upase in the singleton class but fails to find it there. Then follows the normal processing
rules and starts looking up the chain of the superclasses.

### Singletons and Classes

We can define class methods in Ruby using either of the forms `def self.xxx` or
`ClassName.xxx`

```ruby
class Dave
  def self.class_method_one; end

  def Dave.class_method_two; end
end
```
The two forms are identifical because `self` is set to Dave.

There is no such thing as class methods in Ruby, Both of the previous definitions define
singleton methods on the class object.

### Another way to access the singleton class

You can create methods in an object singleton class like this:

```ruby
animal = "dog"
class << animal
  def speak
    puts "The #{self} says WOOF"
  end
end

animal.speak # the dog says WOOF
```

Inside this kind of class definition, self is set to the singleton class for the given
object (animal).
Bc class definitions return the value of the last statement executed in the class body,
we can use this fact to get the singleton class object:

```ruby
animal = "dog"
def animal.speak
  puts "The #{self} says woof"
end

singleton = class << animal
  def lie
    puts "The #{self} lies down"
  end
  self
end

animal.speak # The dog says woof
animal.lie   # The dog lies down
puts "singleton #{singleton}" # singleton Class:<String>
puts "it defined methods #{singleton.instance_methods}" # speak, lie
```

We can append attr_accessor methods invoking it in the singleton class:

```ruby
class Test
  @var = 99
  class << self
    attr_accessor :var
  end
end

puts "og value #{Test.var}"  # 99
Test.var = "cat"
puts "new value #{Test.var}" # cat
```

## 24.3 Inheritance and Visibility

Within a class definition, you can change the visibility of a method in an ancestor class.
For example, you can do something like this:

```ruby
class Base
  def a_method
    puts "Got here"
  end

  private :a_method
end

class Derived1 < Base
  public :am_method
end

class Derived2 < Base
end
```

You can invoke `a_method` instances of class `Derived1` but not via instances of `Base`
or `Derived2`

How does ruby do this?: Ruby effectively inserts a hidden proxy method in the subclass
that invokes the original method using super and then sets the visibility of that proxy
to whatever you requested.

```ruby
class Derived1 < Base
  def a_method(*)
    super
  end
  public :a_method
end
```
The call to super can access the parent's method regardless of its visibility.

## 24.2 Modules and Mixins

Ruby implements `include` very simply: the module that you include is added as a superclass
of the class being defined.
Because the module is injected into the chain of superclasses it must hold a link to the
original parent class.

When you include a module in class `Example` ruby constructs a new class object, makes
it the superclass of Example and then sets the superclass of the new class to be the
original superclass of example. It then references the module's methods from this new
class object in such a way that when you look a method up in this class it looks it up
in the module.

### prepend

Introduced in Ruby 2 this behaves like `include` but the methods in the prepended module
take precedence over those in the host class.

Ruby inserts a dummy class in place of the og host class and then inserting the prepended
module between the two.

If a method inside a prepended module hast the same name as one in the og class it will
be invoked instead of the og.

### extend

Adds to obj the instance methods from each module given as a parameter.

Ruby adds the intance methods in the Humor module into the superclass chain of the class
of obj. Ruby creates a singleton class for obj and then includes the module Humor in that
class.

### Refinements

You can redefine or add functionality to Ruby classes using monkey patching. The scope
of this changes is global.
Refinements are designed to reduce the impact of monkey patching. They provide a way
to extend a class locally:

```ruby
class C
  def foo
    puts "C#foo"
  end
end

module M
  refine C do
    def foo
      puts "C#foo in M"
    end
  end
end
```

Refinements only modify classes not modules to the arguments must be a class.
`Module#refine` created an anonymous module that contains the changes or refinements to
the class (C in this example).

## 24.5 Metaprogramming Class-Level Macros

`attr_accessor` and `has_many` are both examples of class-level methods that generate
code behind the scenes. Bc they expand into something bigger they're commonly known as
`macros`.

Lets implement a simple method that adds logging capabilities to instances of a class.
We previously did this using a module this time we'll do it using a class level method:

```ruby
class Example
  def self.add_logging
    def log(msg)
      STDERR.puts Time.now.strftime("%H:%M:%S: ") + "#{self} (#{msg})"
    end
  end

  add_logging
end

ex = Example.new
ex.log("hello) # produces 12:31:38 # Example...
```
Add logging is a class method, it is defined in the class object's singleton class.
We can call it later in the class definition without an explicit receiver because self
is set to the class object inside a class definition.

The `add_logging` method contains a nested method definition. This inner definition will
get executed only when we call the `add_logging` method. The result is that `log` will
be defined as an instance method of the class example.

We can define `add_logging` method in one class and then use it in a subclass.

We can define log method on each single class we define. Let's add the capability to add
a short class-specific identifying string to the start of each log message:

```ruby
class Song < Logger
  add_logging "Song"
end

class Album < Logger
  add_logging "CD"
end
```

To do this let's define the log method on the fly. We will use the `define_method`. This
takes the name of a method and a block, defining a method with the given name and with
the blocks as the method body. Any arguments in the block definition become parameters
to the method being defined.

```ruby
class Logger
  def self.add_logging(id_string)
    define_method(:log) do |msg|
      now = Time.now.strftime("%H:%M:%S")
      STDERR.puts "#{now}-#{id_string}: #{self} (#{msg})"
    end
  end
end

class Song < Logger
  add_logging "Tune"
end

class Album < Logger
  add_logging "CD"
end

song = Song.new
song.log("rock on") # produces: 12:31:38-Tune: #<Song:0x007f9afb90e1b8> (rock on)
```

The value `now` is a local variable, and `msg` is the parameter to the block.
But id_string is the parameter to the to the enclosing `add_logging` method. It's
accessible inside the block because block definitions create closures, allowing the
context in which the block is defined to be carried forward and used when the block is
used.

We can use the parameter to determine the name of the method or methods to create.
Here's an example that creates a new kind of `attr_accessor` that logs all assignments
to a given instance variable.

```ruby
class AttrLogger
  def self.attr_logger(name)
    attr_reader name

    define_method("#{name}=") do |val|
      puts "Assigning #{val.inspect} to #{name}"
      instance_variable_set("@#{name}", val)
    end
  end
end

class Example < AttrLogger
  attr_logger :value
end

ex = Example.new
ex.value = 123
puts "Value is #{ex.value}"
ex.value = "cat"
puts "Value is now #{ex.value}"

# produces
# Assigning 123 to value
# Value is 123
# Assigning CAT TO VALUE
# Value is now cat
```

We use the fact that the block defining the method body is a closure, accessing the name
of the attribute in the log message string. We use of the fact that `attr_reader` is
simply a class method, we can call it inside our class method to define the reader method
of our attribute.
We use `instance_variable_set` to set the value of an instance variable. There's a
corresponding `_get` method that fecthes the value of a named instance variable.

### Class Methods and Modules

You can use modules to shrink the logic instead of using inheritance, using `extend`
inside class definition

```ruby
module AttrLogger
  def attr_logger(name)
    attr_reader name

    define_method("#{name}=") do |val|
      puts "Assigning #{val.inspect} to #{name}"
      instance_variable_set("@#{name}", val)
    end
  end
end

class Example
  extend AttrLogger
  attr_logger :value
end

ex = Example.new
ex.value = 123
# produces: Assigning 23 to value
```

Things get trickier if you want to add both class methods and instance methods into the
class being defined. Here's one technique used extensively in the implementation of rails.

It uses ruby `included` hook which is called automatically by ruby when you include a
module into a class. It is passed the class object of the class being defined:

```ruby
module GeneralLogger
  # instance method to be added to any class that include us
  def log(msg)
    # meep
  end

  # module containing class methods to be added
  module ClassMethods
    def attr_logger
      attr_reader name

      define_method {} # etc..
    end
  end

  # extend host class with class methods when we're included
  def self.included(host_class)
    host_class.extend(ClassMethods)
  end
end

class Example
  include GeneralLogger

  attr_logger :value
end

ex = Example.new
ex.log("New example created")
ex.value = 123
```

## 24.6 Two other Forms of Class Definition

Subclassing expressions

The thing to the right of the `<` needn't be just a class name; it can be any expression
that returns a Class Object.

The return value from `Struct.new` is c alss object, you can assign this to a constant
and use it as any other class.
We can even override any method inside a class defined as struct.

```ruby
class Person < Struct.new(:name, :address, :likes)
  def to_s
    :meep
  end
end
```

### Creating Singleton Classes

You can pass `.new` a block, that block is the body of the class:

```ruby
some_class = Class.new do
  def self.class_method
    :class_method
  end

  def instance_method
    :instance_method
  end
end
```

By default, these classes will be direct descendents of `Object`. You can give them a
different parent by passing the parent's class as a paremeter:

```ruby
some_class = Class.new(String) do
  # meep
end
```

### How classes get their names

If you create classes with `Class.new` have no name. If you assign the class object for
a class with no name to a constant, Ruby automatically names the class after the constant.

```ruby
some_class = Class.new # no name
SomeClass = some_class # SomeClass name
```

We can reimplement the Ruby `Struct` class:

```ruby
def MyStruct(*keys)
  Class.new do
    attr_accessor *keys

    def initialize(hash)
      hash.each do |key, value|
        instance_variable_set("@#{key}", value)
      end
    end
  end
end
```

## 24.7 instance_eval and class_eval

These methods let you set `self` to be some arbitrary object, evaluate the code in a
block with, and then reset `self`.

```ruby
"cat".instance_eval do
  puts "Upper case = #{upcase}"
  puts "Lenght is #{self.upcase}"
end

# produces
# Upper case = CAT
# Length is 3
```

This is dangerous:
First, is also slow. This compiles the code in the string before executing it.
If there's any chance that external data, can wind up inside the parameter to eval causes
a security hole, that external data may end up containing arbitrary code that your application
bindly execute.


class_eval sets things up as if you were in the body of a class definition, so method
definitions will define instance methods:

```ruby
class MyClass
end

MyClass.class_eval do
  def instance_method
    puts "In an instance method"
  end
end

obj = MyClass.new
obj.instance_method
```

instance_eval on a class acts as if you were working inside the singleton class of self.
Therefore, any methods you define will become class methods:

```ruby
class MyClass
end

MyClass.instance_eval do
  def class_method
    puts "In a class method"
  end
end

MyClass.class_method
```

Ruby also has some variants of these methods:
- `Object#instance_exec`
- `Module#class_exec`
- `Module#module_exec`

### Instance_eval and Domain-Specific Languages

Lets say we're building a simpel DSL for turtle graphics

We can define a class Turtle that defines the various methods we need as instance methods.
We’ll also define a walk method, which will execute our turtle DSL, and a draw method to
draw the resulting picture:

```ruby
class Turtle
  def left; ... end
  def right; ... end
  def forward(n); ... end
  def pen_up; ... end
  def pen_down; ... end
  def walk(...); end
  def draw; ... end
end

turtle = Turtle.new
turtle.walk do
  3.times do
    forward(8)
    pen_down
    4.times do
      forward(4)
      left
    end
    pen_up
  end
end

turtle.draw
```

So, what is the correct implementation of walk ? Well, we clearly have to use instance_eval,
because we want the DSL commands in the block to call the methods in the turtle object.

```ruby
def walk(&block)
  instance_eval(&block)
end
```

Is this a good use of instance_eval ? It depends on the circumstances.
The benefit is that the code inside the block looks simple—you don’t have to make the
receiver explicit:

```ruby
4.times do
  turtle.forward(4)
  turtle.left
end
```

There's a drawback, inside the block you cant reference the instance (turtle).
Instance variables are looked up in `self` and `self` in the block is not the `self` in
the code that sets the instance variable `@size`.

## 24.8 Hook Methods

`included` method is an example of a hook method (or called callback). A hook method is
a method that you write but that Ruby calls from within the interpreter when some particular
event occurs. The interpreter looks for these methods by name.

The methods that can be invoked from within the interpreter are:

**See page 383 of this book**

### The inherited Hook:

If a class defines a class method called `inherited`, Ruby will call it whenever that
class is subclassed.

This hook if often used in situations where a base class needs to keep track of its
children.

For example a shop with a class called `Shipping` want to track of all the varios shipping
options by recording every class that subclasses it.
When it comes time to display the shipping options to the user, the application could
call the base class asking for a list of its children:

```ruby
class Shipping
  @children = []

  def self.inherited(child)
    @children << child
  end

  def self.shipping_options(weight, international)
    @children.select { |child| child.can_ship(weight, international)}
  end
end

class MediaMail < Shipping
  def self.can_ship(weight, international)
    !international
  end
end

class FlatRatePriorityEnvelope < Shipping
  def self.can_ship(weight, international)
    weight < 64 && !international
  end
end

puts "\nShipping 90oz domestic"
puts Shipping.shipping_options(90, false)
```

### The method_missing Hook

If Ruby doesn't find a method by the time we run out of superclasses, then Ruby tries
to invoke the hook method `method_missing` on the original object.
The same process is followed, it first looks in the object's class -> superclass and so on.
Ruby defined `method_missing` on `BasicObject` so the search stops there.

`Method_missing` is simply a Ruby method, we can override it in our own classes to handle
calls to otherwise undefined methods.

You can use, for example use the `method_missing` to implement your own `OpenStruct` class,
if the attribute is not defined, create the attribute.

### Method missing as a Filter

Active record implements their own kind of method missing metaprogramming to define certain
methods like `find_by_xxxx` or `find_all_by_xxx`.

### Demo of metaprogramming

Implementation of creating a module which traces the method execution, page 389.
