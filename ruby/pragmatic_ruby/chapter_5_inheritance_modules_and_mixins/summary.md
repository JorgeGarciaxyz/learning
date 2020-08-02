# Sharing Functionality: Inheritance, Modules, and Mixins

## Modules

Modules are a way of grouping together methods, classes and constants. 

- Modules provide a namespace to prevent name clashes
- Modules support the mixin facility

## Mixin

Meaning: is a "class" (or whatever) that contains methods for use by other classes without having to be the parent class of those classes.
Sometimes are described as being included rather than inherited.

### Mixin on Ruby

The ruby `include` simply makes a reference to a module. The Ruby include statement simply makes a reference to a module.
If that module is in a separate file, youmust use `require` to drag that file in before using include.

A Ruby `include` does not simply copy the module's instance method into the class. Instead it makes a reference from the class to the included module.
If multiple classes include that module, they'll all point to the same thing.

The mixin can interact with code in the class that uses it.

### How Ruby looks for methods

Steps:

1. Looks in the immediate class of an object
2. Mixins include into that class
    - The last one included is searched first
3. Superclasses and their mixins