# Chapter 19 Documenting Ruby

Ruby comes bundled with RDoc, a tool that extracts and formats documentation that’s
embedded in Ruby source code files. This tool is used to document the built-in Ruby classes
and modules.

RDoc does two jobs. First, it analyzes Ruby and C source files, along with some other
formats such as Markdown, looking for information to document.
Second, it takes this information and converts it into something readable.

You can access the documentation with the `ri` command

```
ri Proc
# doc about Proc
```

RDoc automatically finds README, changelogs etc. You can access the list of available
pages from ri using the name of the project and a colon:
`$ ri ruby:`

To read a particular page add its name after the colon:
`$ ri ruby:NEWS`

## 19.1 Adding RDoc to Ruby code

RDoc parses Ruby source files to extract the major elements (such as classes, modules,
methods, attributes, and so on). You can choose to associate additional documentation with
these by simply adding a comment block before the element in the file.

One of the design goals of RDoc was to leave the source code looking totally natural. In most
cases, there is no need for any special markup in your code to get RDoc to produce decent
looking documentation. For example, comment blocks can be written fairly naturally:

```ruby
# meep
def meep
  :meep
end
```

You can also use Ruby's block-comments by including the documentation in a =begin..=end
block. If you use this, the =begin line must be flagged with an rdoc tag to distinguish
the block from other styles of documentation.

```ruby
=begin rdoc
meep
=end
def meep
  :meep
end
```

Within a documentation comment, paragraphs are lines that share the left margin. Text
indented past this margin is formatted verbatim.

Nonverbatim text can be marked up. To set individual words in italic, bold, or typewriter
fonts, you can use _word_ , *word* , and +word+ , respectively. If you want to do this to multiple
words or text containing nonword characters, you can use <em>multiple words</em> , <b>more
words</b> , and <tt>yet more words</tt> . Putting a backslash before inline markup stops it from
being interpreted.

RDoc stops processing comments if it finds a comment line starting with #--.
Documenting can be turned back on by starting a line with the comment #++ :

```ruby
# Extract the age and calculate the
# date of birth.
#--
# FIXME: fails if the birthday falls on February 29th, or if the person
# was born before epoch and the installed Ruby doesn't support negative time_t
#++
# The DOB is returned as a Time object.
#--
# But should probably change to use Date.
def get_dob(person)
end
```

### Hyperlinks

Names of classes, source files, and any method names containing an underscore or preceded
by a hash character are automatically hyperlinked from comment text to their description.

In addition, hyperlinks starting with http: , mailto: , ftp: , and www: are recognized. An HTTP
URL that references an external image file is converted into an inline <img> tag. Hyperlinks
starting with link: are assumed to refer to local files whose paths are relative to the --op
directory, where output files are stored.

Hyperlinks can also be of the form label[url] , where the label is used in the displayed text and
url is used as the target. If the label contains multiple words, surround it in braces: {two
words}[url] .

### Lists

Lists are types as idented paragraphs with the following:
- asterisk or hyphen (-)
- a digiti followed by a period
- uppercase or lowercase letter followed by a period for alpha lists

### Headings

Headings are entered on lines starting with equals signs. The more equals signs, the higher
the level of heading (like markdown)

## Documentation Modifiers

Method parameter lists are extracted and displayed with the method description. If a
method calls yield then the parameters passed to yield will also be displayed.

```ruby
def fred
  yield line, address
end
```

This will be documented as follows:

`fred() { |line, address| ... }`

You can override this using a commented containing :yields" on the same line as the
method definition:

```ruby
def fred # :yields: index, position
  yield line, address
end
```

Which will be documented as follows:

`fred() { |index, position| ... }`

Other modifiers:

`:nodoc: ‹ all ›`

Dont include this element in the doc.

`:doc:`

Forces a method or attr to be documented. This is useful for private methods.

Other modifiers pg 269 of this book.

## 19.2 Adding RDoc to C Extensions

This is possible, check page 270 if you ever need this.

## 19.3 Running RDoc

You run RDoc from the command line:

`$ rdoc <options> <filenames ...>`

Type rdoc --help.

A typical use may be to generate documentation for a package of Ruby source (such as
RDoc itself):

`$ rdoc `

This command generated HTML documentation for the files in and below the current directory.
These will be stored in a doc tree starting in the subdirectory `/doc`.

When writing a Ruby library you often have some source files that implement the public
interface but the majority are internal and of no interest to the readers of your doc.
In these cases construct a `.document` file in each of your project's directories.

If RDoc enters a directory containing a .document file, it will process only the files
in that directory whose names match one of the lines in that file. Each line in the file
can be a filename, a directory name, or a wildcard (a file system “glob” pattern).

For example, to include all Ruby files whose names start with main , along with the file
constants.rb , you could use a .document file containing this:

```ruby
main*.rb
constants.rb
```

### Create Documentation for ri

RDoc is also used to create documentation that will be later displayed using ri.
When you run ri, it by default looks for documentation in three places:
- The system documentation directory, which holds the documentation distributed with
  Ruby and which is created by the Ruby install process
- The site directory, which contains sitewide documentation added locally
- The user documentation directory, stored under the user’s own home directory

You can find these three directories using ri --list-doc-dirs.

`ri --list-doc-dirs`

To add documentation to ri, you need to tell RDoc which output directory to use. For your
own use, it’s easiest to use the --ri option, which installs the documentation into ~/.rdoc :

`$ rdoc --ri file1.rb file2.rb`

If you want to install sitewide documentation, use the --ri-site option:

`$ rdoc --ri-site file1.rb file2.rb`
