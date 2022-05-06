# Managing Dependencies

Suppose the Gear class receives the Wheel arguments:

```ruby
def initialize(chainring, cog, rim, tire)
end

def gear_inches
  ratio * Wheel.new(rim, tire).diameter
  # Shotgun surgery!
  # Use dependency injection.
end
```

Recognizing Dependencies:
- The name of another class. Gear expects a class named Wheel to exist.
- The name of a message that it intends to send to someone other than self. Gear expects a Wheel instance to respond to diameter
- The arguments that a message requires. Gear knows that Wheel.new requires a rim and a tire.
- The order of those arguments. Gear knows that Wheel takes positional arguments and that the first should be rim, the second, tire.

Some degree of dependency between these two classes is inevitable; after all, they must collaborate, but most of the dependencies listed above are unnecessary.
Your design challenge is to manage dependencies so that each class has the few- est possible; a class should know just enough to do its job and not one thing more.

## Inject Dependencies

Reffering to the name class is a minor issue, the big problem is that Gear is only collaborating
with the Wheel class, doesn't matter if other object contains a `diameter` as well.

```ruby
def gear_inches
  ratio * wheel.diameter
end
```
Recognize that the responsibility for knowing the name of a class and the responsibility for know- ing the name of a message to send to that class may belong in different objects.
Because Gear needs to send diameter somewhere does not mean that Gear should know about Wheel.

