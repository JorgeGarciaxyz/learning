# Chapter 23 Duck typing

## 23.1 Classes aren't types

In java the class is not always the type, sometimes the type is a subset of the class,
and sometimes objects implement multiple types.

In ruby the class is `almost` never the type. Instead the type of an object is defined
**by what the object can do** this is duck typing.

If an object walks like a duck and talks like a duck, then the interpreter is happy to
treat is as if it were a duck.

Append to file example

```ruby
def append_name_to_file(file)
  file << @first_name
end

# To test this we can create a file but we dont really need a file, we can pass a single
# string and this would work

meep = ""
append_name_to_file(meep)

# this is duck typing
```

### Other Example

The author worked on a csv generation who performed well until certain point, when the
database grows

```ruby
def csv_from_row(op, row)
  res = ""
  until row.empty?
    entry = row.shift.to_s
    if /[,"]/ =~ entry
      entry = entry.gsub(/"/, '""')
      res << '"' << entry << '"'
    else
      res << entry
    end
    res << "," unless row.empty?
  end
  op << res << CRLF
end

result = ""
query.each_row {|row| csv_from_row(result, row) }

http.write result
```

The culprit? Garbage collection. The approach was
generating thousands of intermediate strings and building one big result string, one line at
a time. As the big string grew, it needed more space, and garbage collection was invoked,
which necessitated scanning and removing all the intermediate strings.

The answer was simple and surprisingly effective. Rather than build the result string as it
went along, the code was changed to store each CSV row as an element in an array. This
meant that the intermediate lines were still referenced and hence were no longer garbage.
It also meant that we were no longer building an ever-growing string that forced garbage
collection. Thanks to duck typing, the change was trivial:

```ruby
result = []
query.each_row {|row| csv_from_row(result, row) }
http.write result.join
```

All that changed is that we passed an array into the csv_from_row method. Because it
(implicitly) used duck typing, the method itself was not modified; it continued to append
the data it generated to its parameter, not caring what type that parameter was. After the
method returned its result, we joined all those individual lines into one big string. This one
change reduced the time to run from more than three minutes to a few seconds.

### 23.2 Coding like a Duck

Take in mind the next code

```ruby
def append_song(result, song)
  result << song.title << " (" << song.artist << ")"
end

result = ""
append_song(result, song)
```

You dont need to check the type of the arguments, if they support `<<` everything would work.
If not, the method will throw an exception anyway.

### 23.3 Standard Protocols and Coercions

Ruby has the concept of `conversion protocols` an object may elect to have itself converted
to an object of another class. Ruby has 3 standard ways of doing this.

**1**
Methods such as `to_s` and `to_i`. The conversion is not strict, as long as the object
have some kind of decent representation as a string.

**2**
Methods with names such as `to_str` and `to_int`. These are strict, you implement them
only if your object can naturally be used every place a string or an integer could be
used. For example, our Roman number objects have a clear representation as an integer
and so should implement to_int.

**3**
Numeric coercion

Here’s the problem. When you write 1+2, Ruby knows to call the + on the object 1 (a Fixnum ),
passing it the Fixnum 2 as a parameter. However, when you write 1+2.3, the same + method
now receives a Float parameter. How can it know what to do (particularly because checking
the classes of your parameters is against the spirit of duck typing)?

This is possible by ruby's `coerce` method.
It takes two numbers (its receiver and its parameter). It returns a two-
element array containing representations of these two numbers (but with the parameter first,
followed by the receiver). The coerce method guarantees that these two objects will have the
same class and therefore that they can be added.

```ruby
1.coerce(2) # [2,1]
(4.5).coerce(2) # [2.0, 4.5]
```

The receiver calls the coerce method of its parameter to generate this array.
