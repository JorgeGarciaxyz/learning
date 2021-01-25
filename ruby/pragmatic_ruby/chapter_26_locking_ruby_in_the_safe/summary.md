# Chapter 26 Locking Ruby in the Safe

Never use `eval` when external data can be passed to.

All external data is dangerous. Don't let it close to interfaces that can modify your
system.

Ruby provides support for reducing this risk. All information from the outside world can
be marked as "tainted". When running in safe mode, potentially dangerous methods will raise
a `SecurityError` if passed a tainted object.

## 26.1 Safe levels

The variable `$SAFE` determines Ruby's level of paranoia:

This scales goes from 0-4, page 410 of this book.

The default value of $SAFE is zero under most circumstances. However, if a Ruby script is 1
run setuid or setgid or if it run under mod_ruby , its safe level is automatically set to 1.
The safe level may also be set by using the -T command-line option and by assigning to $SAFE
within the program. It is not possible to lower the value of $SAFE by assignment.

The current value of $SAFE is inherited when new threads are created. However, within each
thread, the value of $SAFE may be changed without affecting the value in other threads.

## 26.2 Tainted Objects

Any Ruby object derived from some external source (for example, a string read from a file
or an environment variable) is automatically marked as being tainted.

## 26.3 Trusted Objects

Ruby 1.9 adds trust, a new dimension to the concept of safety. All objects are marked as
being trusted or untrusted. In addition, running code can be trusted or not. And, when you’re
running untrusted code, objects that you create are untrusted, and the only objects that you
can modify are those that are marked untrusted. What this in effect means is that you can
create a sandbox to execute untrusted code, and code in that sandbox cannot affect objects
outside that sandbox.

Let’s get more specific. Objects created while Ruby’s safe level is less than 3 are trusted.
However, objects created while the safe level is 3 or 4 will be untrusted. Code running at
safe levels 3 and 4 is also considered to be untrusted. Because untrusted code can modify
only untrusted objects, code at safe levels 3 and 4 will not be able to modify objects created
at a lower safe level.
