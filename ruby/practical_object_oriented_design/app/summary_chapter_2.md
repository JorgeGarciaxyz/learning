# Determining If a Class has a Single Responsibility

One way is to pretend that it’s sentient and to interrogate it. If you rephrase every one of its methods as a question, asking the question ought to make sense. For example, “Please, Mr. Gear, what is your ratio?” seems perfectly reasonable, while “Please, Mr. Gear, what are your gear_inches?” is on shaky ground, and “Please, Mr. Gear, what is your tire (size)?” is just downright ridiculous.

# Hide Data Structures
Use Object Oriented Design to provide a DRY representation of a complex data structure.

```ruby
def initialize(data)
  @wheels = wheelify(data)
end

def diameters
  wheels.collect {|wheel|
    wheel.rim + (wheel.tire * 2)}
end

Wheel = Struct.new(:rim, :tire)
def wheelify(data)
  data.collect {|cell|
    Wheel.new(cell[0], cell[1])}
end
```

# Enforcing SRP
Even the methods should have a Single Responsibility

```ruby
def diameters
  wheels.collect {|wheel|
    wheel.rim + (wheel.tire * 2)}
end

# to
def diameters
  wheels.collect {|wheel| diameter(wheel)}
end

def diameter(wheel)
  wheels.collect {|wheel| diameter(wheel)}
end
```
