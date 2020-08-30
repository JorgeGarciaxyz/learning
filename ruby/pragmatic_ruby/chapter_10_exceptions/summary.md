# Chapter 10 Exceptions, catch and throw

Basic way to handle exceptions

```ruby
begin
  meep
rescue Exception
  puts "exception: #{$!}"
  raise
end
```

When an exception is raised, Ruby places a reference to the associated exception object
in the global variable `$!`.

You can have multiple rescue clauses in a begin block, and each rescue clause can specify
multiple exceptions to catch.
At the end of each rescue clause, you can give the name of a local variable to recieve the
matched exception.

```ruby
begin
  eval string
rescue SyntaxError, NameError => boom
  puts "Failed string: " + boom
rescue StandardError => bang
  print "Error running this: " + bang
end
```

The match on the `rescue` it's pretty similar like case statements, using `===`.

### Ensure

The `ensure` block will always execute at the end.

```ruby
f = File.open

begin
  #...
rescue
  #...
ensure
  f.close
end
```

### Else

If the `else` is present, it goes after the rescue clauses and before any ensure.
This will only be executed if no exceptions are raised by the main body of the code.

### Retry

The retry clause will repeat the entire `begin/end` block.

# Raising exceptions

You can raise exceptions in your code with the `Object#raise` method or `Object#fail`

```ruby
raise # reraises the current exception
raise "bad encoding" # Creates a new RuntimeError exception
raise InterfaceException, "keeb failure", caller
```

The third form uses the first argument to create an exception and then sets the associated
message to the second argument and the stack trace to the third argument. Typically the
first argument will be either the name of a class in the Exception hierarchy or a reference to
an instance of one of these classes. The stack trace is normally produced using the Object#caller
method.

## Adding information to Exceptions

You can define your own exceptions to hold any information that you need to pass out from the sie of an error.

You can, for exampple, set a flag in the exception to tell the handler that can retry the operation.

```ruby
class RetryException < RuntimeError
  attr :ok_to_retry

  def initialize(ok_to_retry)
    @ok_to_retry = ok_to_retry
  end
end
```

Elsewhere the retry error it's raised

```ruby
def read_data(socket)
  data = socket.read(512)
  if data.nil
    raise RetryException.new(true), "transient read error"
  end
end
```

We handle the exception..

```ruby
begin
  stuff = read_data(socket)
  # ... process
rescue RetryException => details
  retry if detail.ok_to_retry
  raise
end
```

## Catch and throw

Catch defines a block that is labeled with the given name (symbol or string).
The block is executed normally until a throw is encountered.

When Ruby encounters a throw it zips back up the call stack looking for a catch block with
a matching symbol. When it fins it, Ruby unwinds the stack to that point and terminates the block.
If the throw is called with the optional second parameter, that value is returned as the value
of the catch.

```ruby
word_list = File.open
word_in_error = catch(:done) do
  result = []
  while line = word_list.gets
    word = line.chomp
    throw(:done, word) unless word =~ //
    result << word
  end
  puts result.reverse
end

if word_in_error
  puts "Failed: #{word_in_error}, found but a word was expected"
end
```

The throw does not have to appear within the static scope of the catch.

```ruby
def prompt_and_get(prompt)
  print prompt
  res = readline.chomp
  throw :quit_requested if res == "!"
  res
end

catch :quit_requested do
  name = prompt_and_get
  age = prompt_and_get
end
```
