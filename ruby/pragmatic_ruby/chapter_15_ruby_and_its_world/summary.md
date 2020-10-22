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
