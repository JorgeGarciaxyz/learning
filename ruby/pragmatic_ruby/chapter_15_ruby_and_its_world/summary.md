# Chapter 15 Ruby and its world

## 15.1 Command-Line Arguments

Options to the Ruby interpreter, optionally the name of a program to run and optionally
a set of arguments for that program:

`ruby options - programfile arguments`

The options are terminated by the first word on the command line that does't start with
a hyphen or by the special flag -- (two hyphens).

If no filename is present on the command line or if the filename is a single hyphen, Ruby
reads the program source from standard input.

The following
`ruby -w - "Hello World"`
will enable warnings, read a program from standard input, and pass it the string "Hello
Worl" as an argument.

### **Command-line Options**
Check this https://ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/options.html

some stuff i'd use
- -c checks syntax only
- -d sets debug and verbose to true
- --disable-all disable the rubygems
- -e specifies the default character encoding
- -v Sets $VERBOSE to true, which enables verbose mode

### **Argument Processing: ARGV and ARGF**

Any command-line arguments after the program filename are available to your Ruby program
in the global array ARGV.
Assume test.rb contains the following program:

```ruby
ARGV.each { |arg| p arg }
```

Invoke it with the following command line:
`ruby -w test.rb "Hello World" a1 1.6180`

It generated the following output:
```
"Hello World"
"a1"
"1.6180"
```

If your program reads from standard input (or uses the special object ARGF) the arguments
in ARGV will be taken to be filenames, and Ruby will read from these files.

If you mix arguments and filenames, make sure you empty the nonfilename arguments from
the ARGV array before reading from the files.

### **ARGF**

It is common for a command line program to take a list of zero or more file names to
process. It will then read through these files in turn, doing whatever it does.

Ruby provides an object referenced by the name ARGF that handles access to these files.
When your program starts, ARGF is initialized with a reference ARGV. Because this is a
reference, changes to make to ARGV are seen by ARGF.

If you red from ARGF or from standard input (by calling gets) Ruby will open the file
whose name is the first element of ARGV and perform the I/O on it.
If you continue to read, you reach the end of that file, Ruby closes it, shifts it out
of the ARGV array and then opens the next file in the list.

You can get to the name of the file currently being read from using `ARGF.filename` and
you can get the current File object as `ARGF.file`. ARGF keeps track of the total number
of lines read in `ARGF.lineno`

### **In-place editing**

In place editing is a hack inherited from Perl. It allows you to alter the contents
of files passed in on the command line, retaining a backup copy of the og contents.

To turn this on, give Ruby the file extension to use for the backup file, either with
the `-i [ext]` command line option or by calling `ARGF.inplace_mode=ext` in your code.

As ur code reads through each file, Ruby will rename the og file by appending the backup
extension. It will then create a new file with the og name and open it for writing
the standard output.
You invoke this using
`ruby -i.bak reverse.rb testfile otherfile` The og files would be available in
testfile.bak and otherfile.bak

## **15.3 Environment Variables**

You can acess operating system env variables using the predefined variable ENV.
It responds to the same methods as Hash.

Check page 215 of this book to see the env variables used by Ruby.

### **Writing to Environment Variables**

A ruby program may write to the ENV object. On most systems, this changes the values of
the corresponding env variables. However this changes is local to the process that makes
it and to any subsequently spawned child processes.

The changes made on the sub processes are not visible to the og parent.

## 15.4 Where Ruby find its Libraries

When Ruby is built for your particular machine, it predefines a set of standard
directories to hold libreary stuff. Where these are depends on the machine in question.
`ruby -e 'puts $:'`

The `site_ruby` directories are intender to hold modules and extensions that you've added.

Sometimes this isn't enough. For example if someone built a substantial library of Ruby
code you want everyone on the team to hace access to this.
If your program runs at a safe level of zero you can set the environment variable RUBYLIB
to a list of one or more directories.

## Reading Gem documentation

The most reliable way to find the documents is to ask the gem command where your RubyGem
main directory is located:

`gem environment gemdir`

The easiest way to view gem's RDoc documentation is to use RubyGem's included gem server
utility, to start gem server type

`gem server`

### Specify gem version

If you need to specify an speific version you can use:

```ruby
gem "builder", "< 1.0"

require "builder"
```

## 15.6 The Rake Build Tool

Rake is an automation tool. Think of rakes as tasks, a chunk of code that Rake can
execute for us.

Rake searches the current directory for a file called Rakefile. This file contains
definitions for the tasks that Rake can run.

Ex:

```ruby
desc "Remove files whose names end with a tilde"

task :delete_unix_backups do
  files = Dir['*~']
  rm(files, verbose: true) unless files.empty?
end
```

Althought this doesn't have an .rb extension, this is actually just a file of Ruby code.

Rake defines an environment containing methods such as desc and task and then executes
the Rakefile.

The desc method provides a single line of documentation for the task that follows it.
The task method defines a Rake task that can be executed from the command line.

We can invoke this task from the command line
`rake delete_unix_backups`

Let's say that our application could be used on windows and unix, Rake give us a way to
do this, let us `compose` tasks. Here's an example:

```ruby
desc "Remove Unix and Windows backup files"
task :delete_backups => [:delete_unix_backups, :delete_windows_backups] do
  puts "all backups deleted"
end
```

The task depens on two other tasks. We pass the task method a Ruby hash containing a
single entry whose key is the task name and whose value is the list of antecedent tasks.

This causes Rake to execute the two platform-specific tasks before executing the delete
backup task.

You can also define `Ruby methods` on the Rakefile

You can find the tasks implemented by a Rakefile

`rake -T`

## 15.7 Build Environment

When Ruby is compiled for a particular architecture all the settings used to build it
are written to the module RbConfing within the library file `rbconfig.rb`.

After installation, any Ruby program can use this module to get details on how Ruby was
compiled:

```ruby
require "rbconfig"

include RbConfig
CONFIG["host"] # => Linux..
CONFIG["libdir"] # => users/...
```
