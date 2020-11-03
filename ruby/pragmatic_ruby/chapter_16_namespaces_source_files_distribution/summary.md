# Chapter 16 Namespaces, Source Files and Distribution

## 16.1 Namespaces

Ruby's double colon (::) is Ruby's namespace resolution operator.

Ruby has a secret; the names of classes and modules are themselves just constants.
That means that if you define classes or modules inside other classes and modules, the
names of those inner classes are just constants that follow the same namespacing rules
as other constants.

## 16.2 Organizing your Source

The ruby community gradually adopt a kind of defacto standard to organize code.

## Small Programs

You can store scripts inside a single file but you won't easily be able to write tests
for this because the test code won't be able to load the file containing your source
without program itself running.

You can split that program into a trivial driver that provides the external interfaces
(the command-line part of the code) and one or more files containing the rest.

Your tests can then excercise these separate files without actually running the main body
of your program.
