# Chapter 6 Standard Types

## Numbers

Integers within a certain range (-2^30, -1, etc..) are held internally in binary form and are objects of class Fixnum.

Integers outside this range are sotred in objects of class Bignum.

This process is transparent and Ruby automatically manages the conversion back and forth.

## Rational and complex numbers

You crete them using explicit calls to the constructor methods Rational and Complex.

```ruby
Rational(3, 4) * Rational(2, 3) # => (1/2)

Complex(1, 2) * Complex(3, 4) # => (-5+10i)
```

## Interactions between numbers

If do an operation of numbers with different classes, the result will have the class of the more general one.

- If you mix float + int = float
- float + complex = complex

If you want that an integer division return a fraction (Rational) you'll need require the mathn library.
This will cause arithmetic operations to attempt to find the mos natural representation for their results.
For integer division where the result is not an integer, a fraction will be returned.

```ruby
require "mathn"

22/7 # => (22/7)
Complex::I * Complex::I # => -1
```

## Looping

Integers support several iterators, if you leave the block off, the call returns an Enumerator object. Exs:

```ruby
3.times

1.upto(5)

10.downto(7).with_index { |num, index| puts "#{index}: #{num}" }
```

## Heredoc

Large block of texts that you specify after the << characters.

```ruby
string = <<-END_OF_STRING
hey there
meep
END_OF_STRING
```


## Working with strings

### Squeeze

Returns a new string replacing repeated characters with single character.

```ruby
"yellow moon".squeeze #=> "yelow mon"
```

## Ranges

Ruby implement three separate features: sequences, conditions and intervals.

### Ranges as Sequences

Sequences have a start point, and end point and a way to produce successive values in the sequence.
The two-dot form creates an inclusive range, and the three-dot form creates a range that excludes the specified high value.

```ruby
(1..10).to_a # [1,2 ..., 10]
("bar".."bat") # => ["bar, "bas", "bat"]
```

The range 1..1000000 is a `Range` object containing references to two `Fixnum` objects. If you convert this range into an array, all that memory will get used.


### Spaceship operator

It's a general comparison operator. It returns either a -1, 0, or +1 depending on whether its receiver is less than, equal to, or greater than its argument.

### Ranges as Conditions
As well as representing sequences, ranges can also be used as conditional expressions. Here,
they act as a kind of toggle switch—they turn on when the condition in the first part of the
range becomes true, and they turn off when the condition in the second part becomes true.

### Ranges as intervals

The ranges can be used as an interval test; seeing whether some value falls within the interval represented by the range.
We do this using the `===` case equality operator.

```ruby
(1..10) === 5 # => true
(1..10) === 15 # => false
```

