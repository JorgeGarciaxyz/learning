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
