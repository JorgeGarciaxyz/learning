# Chapter 25 Reflection, ObjectSpace and Distributed Ruby

## 25.1 Looking at Object

Ruby let you traverse all the living objects in your program using
`ObjectSpace.each_object`

Iterate tru objects of type Complex:
```ruby
a = Complex(1,2)

ObjectSpace.each_object(Complex) { |x| puts x }
```

### Looking inside objects

We can get a list of all the methods to which an object will respond and if they respond
to a particular method:

```ruby
r = 1..10
r.methods

r.respond_to?(:has_key) # false
```

## 25.2 Looking at Classes

You can get the parent of any class using `Class#superclass`.
For classes and modules, the Module `#ancestors` method lists both superclasses and
mixed-in modules.

### Looking inside Classes

We can get the list of the methods we want usign the next methods:

```ruby
Demo.private_instance_methods(false)
Demo.protected_instance_methodsd(false)
Demo.public_instane_methods(false)

Demo.singleton_methods(false)
Demo.class_variables
Demo.constants(false)
```

The false parameters are by default recurse into parent classes, their parents and so on
up to the ancestor chain. Passing in false stops this kind of prying.

## 25.3 Calling methods Dynamically

You can invoke methods by name using `send`

Another way of invoking methods uses `Method` objects. Is like a Proc object, it represent
a chunk of code and a context in which it executes.
The code is the body of the method and the context is the object that created the method.
Once we have our Method object, we can execute it sending the message call.

```ruby
trane = "John Coltrane".method(:length)

trane.call # => 13
```

Is like having a C-style function pointer but in a fully object-oriented style.

You can create `unbound` methods and then bind them to one or more objects. The binding
creates a new Method object. As with aliases, unbound methods references to the definition
of the method at the time they're created.

```ruby
unbound_length = String.instance_method(:length)

class String
  def length
    99
  end
end

str = "cat"
str.length # => 99

bound_length = unbound_length.bind(str)
bound_length.call # => 3
```

Thereis another way to invoke methods dynamically, "eval" method. This will parse and
execute an arbitrary string of legal Ruby source code.

### Performance considerations

The `eval` method is significantly slower than the others.

## 25.4 System Hooks

A hook is a technique that lets you trap some Ruby event, such as object creation.

### Hooking Mehtod calls

The simplest hook technique is to intercept calls to methods in system classes.
Let's say you want to log all the OS commands your program executes.
Rename the method `Kernel.system` and substitute it with one of your own that both logs
the command and calls the original `Kernel` method:

```ruby
class Object
  alias_method :old_system, :system

  def system(*args)
    old_system(*args).tap do |result|
      puts "system(#{args.join(', ')}) returned #{result.inspect}"
    end
  end
end

system("date")

# produces:
# Mon May 27 12:31:42 CDT 2013
# system(date) returned true
```

The problem with this technique is that you’re relying on there not being an existing method
called old_system. A better alternative is to make use of method objects, which are effectively
anonymous:

```ruby
class Object
  old_system_method = instance_method(:system)

  define_method(:system) do |*args|
    old_system_method.bind(self).call(*args).tap do |result|
      puts "system(#{args.join(', ')}) returned #{result.inspect}"
    end
  end
end
```

Ruby 2.0 give us a new way of doing this. Modules can be used to include new instance
methods in some other module or class.
Until now these methods were added behind the host module or class's own methods, if the
module defined a method with the same name as one in the host, the host method would be
called.

Ruby adds the prepend method to modules. This lets you insert the module's methods `before`
the host's. Within the module's methods calling `super` calls the host's method of the
same name.

```ruby
module SytemHook
  private
  def system(*args)
    super.tap do |result|
      puts "system(#{args.join(', ')}) returned #{result.inspect}"
    end
  end
end

class Object
  prepend SytemHook
end
```

### Object Creation Hooks

We'll add a timestamp to every object as it's created. Lets first add a `timestamp` attribute
to every object in the system

```ruby
class Object
  attr_accessor :timestamp
end
```

Then, we need to hook object creation to add this timestamp. One way to do this is to do
our method-renaming trick on `Class#new` the method that's called to allocate space for
a new object.

```ruby
class Class
  old_new = instance_method :new

  define_method :new do |*args, &block|
    result = old_new.bind(self).call(*args, &block)
    result.timestamp = Time.now
    result
  end
end

class Test
end

obj1 = Test.new

sleep(0.002)

obj2 = Test.new

obj1.timestamp.to_f # => 1369675903.251721
obj2.timestamp.to_f # => 1369675903.2541282
```

## 25.2 Tracing Your program's Execution

You can watch the interpreter as it executes code. Using the class `TracePoint`.
Use a proc to execute all kinds of debugging whenever a new source line is executed.
Methods are calles, objects etc.

```ruby
class Test
  def test
    a = 1
  end
end

TracePoint.trace do |tp|
  p tp
end
t = Test.new
t.test

# produces
#<TracePoint:c_return `trace'@prog.rb:7>
#<TracePoint:line@prog.rb:10>
#<TracePoint:c_call `new'@prog.rb:10>
#<TracePoint:c_call `initialize'@prog.rb:10>
#<TracePoint:c_return `initialize'@prog.rb:10>
#<TracePoint:c_return `new'@prog.rb:10>
#<TracePoint:line@prog.rb:11>
#<TracePoint:call `test'@prog.rb:2>
#<TracePoint:line@prog.rb:3 in `test'>
#<TracePoint:return `test'@prog.rb:4>
```

The method `trace_var` lets you add a hook to a global variable, whenever an assignment
is made to the global, your proc is invoked.

### How did we get here?

You can find out "how you got here" using the method `caller`, which returns an array
of strings representing the current call stack:

```ruby
def cat_a
  puts caller
end

def cat_b
  cat_a
end

def cat_c
  cat_b
end

cat_c

# produces
# prog.rb:5 in 'cat_b'
# prog.rb:8 in 'cat_c'
# prog.rb:10 in main
```

### Source code

Ruby execute programs from plain old files. You can look at these files to examine the
source code that makes up your program using one of a number of techniques.

The special variable `__FILE__` contains the name of the current source file.
```ruby
print File.read(__FILE__)
# produces:
print File.read(__FILE__)
```

As we saw in the prec section, the method `Object#caller` returns the call stack as alist
Each entry in the list starts off with a filename, a colon and a line number in that file.
You can parse this information to display source.

## 25.6 Behind the curtain: the ruby VM

Ruby 1.9 comes with a new virtual machine called `YARV`. YARV exposes some of its state
via Ruby classes.

If you’d like to know what Ruby is doing with all that code you’re writing, you can ask
YARV to show you the intermediate code that it is executing.

```ruby
code = RubyVM::InstructionSequence.compile('a = 1; puts 1 + a')
puts code.disassemble

# produces a bunch of things
```

## 25.7 Marshaling and Distributed Ruby

Ruby features the ability to serialize objects, letting you store them somewhere and reconstitute
them when needed. You can use this facility, for instance, to save a tree of objects
that represent some portion of application state—a document, a CAD drawing, a piece
of music, and so on.

Ruby calls this kind of serialization marshaling (think of railroad marshaling yards where
individual cars are assembled in sequence into a complete train, which is then dispatched
somewhere).

We have a class Chord that holds a collection of musical notes.
We’d like to save away a particularly wonderful chord so we can e-mail it to a couple hundred of
our closest friends so they can load it into their copy of Ruby and savor it too. Let’s start
with the classes for Note and Chord:

```ruby
# chord.rb
Note = Struct.new(:value) do
  def to_s
    value.to_s
  end
end

class Chord
  def initialize(arr)
    @arr = arr
  end

  def play
    @arr.join("-")
  end
end
```

Now we'll create ans use marshal.dump to save a serialized version to disk:
```ruby
# chord.rb
c = Chord.new([Note.new("G"), Note.new("E")])

File.open("posterity", "w+") do |f|
  Marshal.dump(c, f)
end

# you can read it
chord = Marshal.load(File.open("posterity"))
chord.play # => "G-Bb-Db-E"
```

### Distributed Ruby

You can use `drb` library to achieve this.
