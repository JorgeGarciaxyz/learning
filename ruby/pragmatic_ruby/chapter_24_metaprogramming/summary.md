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
