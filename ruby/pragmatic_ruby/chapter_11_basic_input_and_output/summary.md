# Chapter 11 Basic Input and Output

A whole set of I/O related methods is implemented in the Kernel Module:
- gets, open, print, printf, putc, puts, readline, readlines and test

These methods Typically do I/O to standard input and output, which makes them
useful for writing filters.

You can also use another way to have more control, IO objects

## IO Object

Ruby defines a single base class IO to handle all input and output.
An IO object is a bidirectional channel between a Ruby program and some external resource.

## Opening and Closing Files

You can create a new file object using File.new

```ruby
file = File.new("testfile", "r")
# proces...
file.close
```

The method File.open also opens a file. It behaves like File.new. If you associate a block with the call
`open` behaves differently. Instead of returning a new File object, it invokes the block passing the File as parameter.
When the block exits, the file is closed.

```ruby
File.open("meep", "r") do |file|
  # process
end
```

If something happens on example #1 (an exception) the file would not close.
If something happens on example #2 the file would close.

## Reading and writing files

`gets` reads a line from standard input (or any files specified from the command line) and `file.gets`
reads a line from the file object `file`

```ruby
while line = gets
  puts line
end
```

If we run this program without arguments it will read lines from the console and copy them to the console.
Note that each line is echoed once the return key is pressed.

We can also pass one or more filenames, they will get read from each in turn.
`ruby copy.rb testfile`

### Iterators for Reading

You can also use Ruby IO iterators. `IO#each_byte` invokes a block with the next 8-bit byte from the IO object.
The `chr` method converts an integer to the corresponding ASCII character.

```ruby
File.open("testfile") do |file|
  file.each_byte.with_index do |ch, index|
    #meep
  end
end
```

`IO#each_line` call the block with each line from the file.

`IO#foreach` Takes the name of an I/O source, opens it for reading, calls the iterator once for each line and closes the file.

```ruby
IO.foreach("testfile") { |line| puts line }
```

## What is dis doing?

Every object you pass to `puts` and `print` is converted to a string by calling that
object `to_s` method.

If for some reason the `to_s` method doesnt return a valid string a string is created
containing the object's class name and ID, something like `<ClassName:0x123456>`

### Binary Data
You can use `sysread` and `syswrite` to manage i/o of binary stuff.
How do you get the binary data into a string in the first place?
- literal
- byte by byte
- Array#pack

```ruby
str1 = "\001\002\003" # => "\u001\u002\u003"

str2 = ""
str2 << 1 << 2 << 3 # => "\u001\u002\u003"

[1, 2, 3].pack("c*") # => "\x01\x02\x03"
```

# Doing I/O with String

There are some times where you need to work with code that assumes it's reading from or
writing to one or more files but the data isn't in files (like json, soap).

`StringIO` objects. They behave just like other I/O objects but they read and write strings,
not files.

- If you open a `StringIO` object for reading, you supply it with a string
- All read operations then read from this string
- When you want to write to a `StringIO` object, you pass it a string to be filled

```ruby
require 'stringio'
ip = StringIO.new("now is\nthe time\nto learn\nRuby!")
op = StringIO.new("", "w")

ip.each_line do |line|
  op.puts line.reverse
end

op.string # => "\nsi won\n\nemit eht\n\nnrael ot\n!ybuR\n"
```

# Talking to networks

Ruby comes with a set of classes in the socket library.
These give you access to TCP, UDP, SOCKS and UNix domain sockets and any socket types
supported on your architecture.

The library also provides helper classes to make writing server easier.

```ruby
require "socket"

client = TCPSocket.open("localhost", "www")
client.send("OPTIONS /~dave/ HTTP/1.0\n\n", 0) # 0 means standard packet
puts client.readlines
client.close
```

The lib/bet library modules provides handlers for a set of application level protocols
(FTP, HTTP, POP, SMTP, telnet).
The next program lists the images that are displayed on this books home page.

```ruby
require "net/http"

http = Net::HTTP.new("meeep.com", 80)
response = http.get("/book/12")

if response.message == "OK"
  puts response.body.scan(/<img alt=".*?" src="(.*?)"/m).uniq[0,3]
end
```

We can take this to a higher level still. By using the open-uri library into a program
the `Object#open` method suddengly recognizes `http` and `ftp` in the filename.

```ruby
require "open-uri"

open('http://pragprog.com') do |f|
  puts f.read.scan(/<img alt=".*?" src="(.*?)"/m).uniq[0,3]
end
```

# Pasing HTML

The nokogiri library is very popular. It's a very rich library

```ruby
require 'open-uri'
require 'nokogiri'

doc = Nokogiri::HTML(open("http://pragprog.com/"))

puts "Page title is " + doc.xpath("//title").inner_html

# Output the first paragraph in the div with an id="copyright"
# (nokogiri supports both xpath and css-like selectors)
puts doc.css('div#copyright p')

# Output the second hyperlink in the site-links div using xpath and css
puts "\nSecond hyperlink is"
puts doc.xpath('id("site-links")//a[2]')
puts doc.css('#site-links a:nth-of-type(2)')
```

This produces
```
produces:
Page title is The Pragmatic Bookshelf
<p>
The <em>Pragmatic BookshelfTM</em> is an imprint of
<a href="http://pragprog.com/">The Pragmatic Programmers, LLC</a>.
<br>
Copyright © 1999–2013 The Pragmatic Programmers, LLC.
All Rights Reserved.
</p>
Second hyperlink is
<a href="http://pragprog.com/about">About Us</a>
<a href="http://pragprog.com/about">About Us</a>
```

Nokogiri can also update and create HTML and XML
