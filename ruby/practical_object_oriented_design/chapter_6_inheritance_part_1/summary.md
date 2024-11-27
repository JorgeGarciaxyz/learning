# Chapter 6 Inheritance

**Pages: 105 - 140**

### 6.1 Understanding Classical Inheritance

Inheritance defines a forwarding path for not-understood messages. It creates a relationship
that if some class can't respond to a message, is delegated to another class.

### 6.2 Recognizing where to use inheritance

Having the next class:

```ruby
class Bicycle
  attr_reader :size, :tape_color

  def initialize(**opts)
    @size = opts[:size]
    @tape_color = opts[:tape_color]
  end

  def spares
    {
      chain: "11-speed",
      tire_size: "23",
      tape_color: tape_color
    }
  end
end
```

The above class isn't perfect but it gets the job done. But what happens if we want to
support a new type of bike, a mountain bike?

Mtb bikes have diferent spare parts, like front and rear shocks. The new code looks like this:

```ruby
class Bicycle
  attr_reader :size, :tape_color, :style, :tape_color, :front_shock, :rear_shock

  def initialize(**opts)
    @style = opts[:style]
    @size = opts[:size]
    @tape_color = opts[:tape_color]
    @front_shock = opts[:front_shock]
    @rear_shock = opts[:rear_shock]
  end

  def spares
    if style == :road
      {
        chain: "11-speed",
        tire_size: "23",
        tape_color: tape_color
      }
    else
      {
        chain: "11-speed",
        tire_size: "2.1", # inches
        front_shock: front_shock,
        rear_shock: rear_shock
      }
    end
  end
end

mtb_bike = Bicycle.new(
  style: :mountain,
  size: "S",
  front_shock: "Suntour",
  rear_shock: "Fox"
)

road_bike = Bicycle.new(
  style: :road,
  size: "M",
  tape_color: "red"
)
```

This code make decisions based on the `style` (or type). If you add a new style, the `if`
block needs to change. An unexpected style will do something but not what you expect.

**This code contains an if statement that checks an attribute that holds the category of self to determine what message to send to self**.

### 6.2.3 Finding the types

Variable types with a name such as `category` or `type` are a clue to notice the underlying pattern.

Inheritance aims to solve the exact problem the above code is suffering, highly related types
that share common behavior but differ along.

# 6.4 Finding the right abstraction

For inheritance to work, two things must always be true:

**1. The objects you're modeling must truly have a generalization-specialization relationship.**
**2. Use the correct coding techniques.**

### 6.4.2 Promoting Abstract Behavior

The general rule for refactoring into a new inheritance hierarchy is to arrange code so that
you can promote abstractions rather than demote concretions.

### 6.4.4 Using the Template Method Pattern

Ex:
```ruby
class Bicycle
  def initialize(**opts)
    @chain = opts[:chain] || default_chain
  end
end

class MtbBike < Bicycle
  def default_chain
    "31 spikes"
  end
end
```

While wrapping the defaults in methods  is good practice, this serve a dual purpose.
Bicycle main goal in sending these messages is to give subclasses an opportunity to contribute
specializations by overriding them.

This technique of defining a basic structure in the superclass and sending messages to
acquire subclass-specific contributions is known as **template method** pattern.

### 6.4.5 Implementing every template method

`Bicycle` initialize method sends `default_chain` but `Bicycle` does not implement it. This
is desastrous for new classes, so always make sure this is implemented.

Any class that uses the template method pattern must supply an implementation for every messages
it sends. Even if it looks like this:

```ruby
class Bicycle
  def default_chain
    raise NotImplementedError
  end
end
```

Creating code that fails with reasonable error messages takes minor effort in the present,
but provides value forever. Each error message is a small thing, but small things accumulate
to produce big effects, this attention to detail marks you as a serious programmer.

**Always** document template methods requirements by implementing matching methods that raise useful
errors.

## 6.5 Managign coupling between Superclasses and Subclasses

### 6.5.1 Understanding coupling

This implementation is easy but produces the more tightly coupling.

```ruby
class RoadBike < Bike
  def spares
    {
      chain: "11-speep",
      tire_size: "23",
      tape_color: tape_color
    }
  end
end

class MtbBike < Bike
  def spares
    super.merge(front_shock: front_shock)
  end
end

class Bike
  def spares
    {
      tire_size: tire_size,
      chain: chain
    }
  end
end
```

Final implementation:
```ruby
class Bike
  def initialize(**opts)
    @size = opts[:size]
    @chain = opts[:chain]
    @tire_size = opts[:tire_size] || default_tire_size
  end

  def spares
    {...}
  end

  def default_chain
    "11-sped"
  end

  def default_tire_size
    raise NotImplementedError
  end
end

class Mtb < Bike
  def initialize(**opts)
    @front_shock = opts[:front_shock]
    super
  end

  # rest of the code...
end

class Road < Bike
  def initialize(**opts)
    @tape_color = opts[:tape_color]
    super
  end
end
```

Each subclass follow a similar pattern, they know things about themselves and their superclass.
Knowing things about other classes creates dependencies and this creates coupling between objects.

Creating a new bike is a booby trap:
```ruby
class EBike < Bike
  def initialize(**opts)
    @flag = opts[:flag] # forgot to send super
  end
end

e_bike = EBike.new
e_bike.spares # raise tire_size not implemented as isn't initialized via super...
```

This pattern requires subclasses not only know what they do but how they're supposed to interact
with their superclass. Forcing a subclass to know how to interact with its abstract superclass
causes many problems.

It creates the next problems:
- Forces each subclass to send super to participate
- It causes duplication of code requiring all send super in exactly the same places.
- Raises the change that future programmers will create errors when writing new subclasses,
  as they can easily forget to send super.

### 6.5.2 Decoupling Subclasses Using Hook Messages
