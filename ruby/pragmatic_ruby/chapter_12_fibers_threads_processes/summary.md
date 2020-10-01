# Chapter 12 Fibers, Threads and Processes

Ruby gives you two basic ways to organize your program so that you can run different parts
of it "at the same time".

Fibers let you suspend execution of one part of your program and run other part.

For more decoupled execution, you can split up cooperating tasks within the program,
using multiple threads, or you can split up tasks between different programs, using multiple
processes.

# Fibers

Fibers are a very simple coroutine mechanism.
They let you write programs that look like you're using threads without incurring any
of the complexity inherent in threading.

We'd like to analyze a text file, counting the ocurrence of each word. Without fibers
this can be solved with a simple loop.

```ruby
counts = Hash.new(0)

File.foreach("testfile") do |line|
  line.scan(/\w+/) do |word|
    word = word.downcase
    counts[word] += 1
  end
end
```

This code is messy, mixes word finding with word counting. We could fix this by writing
a method that reads the file and yields each successive word.

BUUUUT fibers give us a "simpler" (im not sure anymore) solution:

```ruby
words = Fiber.new do
  File.foreach("testfile") do |line|
    line.scan(/\w+/) do |word|
      Fiber.yield word.downcase
    end
  end
  nil
end
# The constructor takes a block and returns a fiber object. The code in the block is not
# executed

counts = Hash.new(0)

while word = words.resume
  counts[word] +1
end

# We call `resume` on the fiber object. This causes the block to start execution.
```
The file is opened and the scan method starts extracting individual words. At this point
`Fiber.yield` is invoked. This suspends execution of the block - the resume method that
we called to run the block returns any value given to Fiber.yield.

Our program enters the body of the loop and increments the count for the first word
returned by the fiber.
It then loops back up to the top of the while loop, which again calls `words.resume`
while evaluating the condition.

When the fiber runs out of words in the file, the foreach block exits and the code in the
fiber terminates. The returned value of the fiber will be the value of the last
expression evaluated (in this case nil).
You'll get a `FiberError` if you attempt to call resume again after this.

Fibers are often used to generate values from infinite sequences on demand.
Here's a fiber that returns successive integers divisible by 2 and not by 3.

```ruby
twos = Fiber.new do
  num = 2
  loop do
    Fiber.yield(num) unless n % 3 == 0
    num += 2
  end
end

10.times { print twos.resume, " " }
# produces
2, 4, 8, 10...
```

Because Fibers are just object you can pass them around, store them on variables etc.
Fibers can be resumed only in the thread that created them.

## Fibers, Coroutines and Continuations

The basic fiber support in Ruby is limited.
Ruby comes with two standard libraries that extend this behavior.

The fiber library adds full coroutine support.
Once it is loaded, fibers gain a transfer method, allowing them to transfer control to
arbitrary other fibers.

A related but more general mechanism is the `continuation`. A continuation is a way of
recording the state of your running program and then resuming from that state at some
point in the future.

Continuations have also been used to store the state of a running web application between
requests.

A continuation is created when the app sends a response to the browser; then, when the
next request arrives from that browser, the continuation is invoked and the application
continues from where it left off.
