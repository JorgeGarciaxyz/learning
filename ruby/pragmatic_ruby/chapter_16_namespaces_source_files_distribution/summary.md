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

.....
Example of the book which I dont wanna copy page 228
.....

We'll create a directory for our project containing three subdirectories:

```
anagram/ <- top level
  bin/   <- command-line interface goes here
  lib/   <- three library files go here
  test/  <- test files go here
```

The `require_relative` it loads code from a path relative to the directory of the file
that invokes it.

The command-line interface it is located in the bin/ directory, in a file called
`anagram`

```
#! /user/local/rubybook/bin/ruby
require "anagram/runner"

runner = Anagram::Runner.new(ARGV)
runner.run
```

This command invokes the `lib/anagram/runner`

```ruby
# lib/anagram/runner
require_relative "finder"
require_relative "options"

module Anagram
  class Runner
    def initialize(argv)
      @options = Options.new(argv)
    end

    def run
      finder = Finder.from_file(@options.dictionary)
      ...etc
    end
  end
end
```

Now you can run this
`$ ruby -I lib bin/anagram teaching code`

## 16.3 Distributin and Installing your Code

When Ruby is installed, it puts its commands into a directory of binary files.
It puts its libraries into another directory tree and documentation somewhere else.

### Using RubyGems

RubyGems needs to know information about your project that isn't contained in the
directory, instead you have to write a short RubyGems specification: a GemSpec.

Create this in the top-level directory of your application. (anagram.gemspec in this case)

```ruby
Gem::Specification.new do |s|
  s.name
  ....
  s.requirements          = ['An installed dictionary']
  s.platform              = Gem::Platform::RUBY
  s.required_ruby_version = ">=1.9"
  s.files                 = Dir['**/**']
  s.executables           = ['anagram']
  s.test_files            = Dir["test/test*.rb"]
  s.has_doc               = false
end
```

### Packaging your RubyGem

Once the spec is complete, you'll want to create the packaged.gem file for distribution.
This is as easy as navigating to the top level of ur project and type this:
`$ gem build anagram.gemspec`

You'll find you now have a file called anagram-0.0.1.gem

You can install it:
`$ sudo gem install pkg/anagram-0.0.1.gem`

You can send your gem to a server or if you have RubyGems installed on your local box,
you can share them over the network to others, run this:
`$ gem server`

This starts a server and other people can connect to your server to list and retrieve
RubyGems

`$ sudo gem install pkg/anagram-0.0.1.gem`

You can also push them into ruby gems
`$ gem push anagram-0.0.1.gem`

### Quick setup

The jeweler library can create a new project skeleton that follows the layout guidelines
in this chapter, it also provides a set of Rake tasks that will help create and manage
your project as a gem.

Bundler helps manage the gems used by your application. Bundler manage the gems used by
any piece of Ruby code.
