# IRB

## 18.1 Command line

Loading code from files

```
irb
load 'code/irb/meep.rb'
```

Load allow us to load the same file multiple times so if we find a bug we just reload
the file into our session.

### Tab completion
Tab completion is implemented as an extension library, in some systems this is loaded by
default. On others, you'll need to load it when you invoke irb from the command line:

`irb -r irb/completion`

You can also load the completion library when irb is running:
```
require 'irb/completion'
```

### Subsessions

Irb supports multiple concurrent sessions one is always current the others lie dormant
til activated. Entering the command irb withint irb creates a subsession, entering the
jobs command lists all sessions and entering fg activates a particular dormant session

```ruby
irb

irb

jobs
ruby 2.0 > jobs
=> #0->irb on main (#<Thread:0x00000100887678>: stop)
#1->irb#1 on main (#<Thread:0x00000100952710>: running)
ruby 2.0 > fg 0
=> #<IRB::Irb: @context=#<IRB::Context:0x000001008ea6d8>, ...
```

#### Subsessions and bindings

If you specify an object when you create a subsession the object becomes the value of
self in that binding.

```ruby
> irb "wombat"
> self
=> "wombat"
```

### Initialization File

irb uses an initialization file in which you can set commonly used options or execute any
required Ruby statements. When irb is run it will try to load an initialization file from
one of the following sources in order: `~/.irbrc , .irbrc , irb.rc , _irbrc , and $irbrc .`

Within the initialization file you may run any arbitrary ruby code and set config values.
The values that can be used in an initialization file are the symbols. You can use these
symbols to set values into the `IRB.conf` hash.

### Extending irb

You can extend irb by defining new top-level methods.

Add the next to the `.irb` file:

```ruby
def time(&block)
  require "benchmark"
  result = nil
  timing = Benchmark.measure do
    result = block.()
  end

  puts "It took: #{timing}"
  result
end
```

Next time you login you can use
`time { :meep }`

### Interactive Configuration

Most config values are available while you're running `irb`

`conf.prompt_mode = :SIMPLE`

### irb Configuration Options

review this https://docs.ruby-lang.org/en/2.7.0/IRB.html

## 18.2 Commands

`help ClassName, string or symbol`
Displays the ri help for the given thing

```ruby
help "String.encoding"
```

`conf, context, irb_context`
Displays current Configuration. Modifying the configuration is achieved by invoking
methods of conf.

`cb, irb_change_binding`
Creates and enters a new binding (sometimes called a workspace) that has its own scope.

### Configuring the Prompt

Sets of prompts are stored in the prompt hash, IRB.conf[:PROMPT].
Once you’ve defined a prompt, you have to tell irb to use it. From the command line, you
can use the --prompt option.

`irb --prompt my=prompt`

### Saving Your Session History

If you have readline support in irb (that is, you can hit the up arrow key and irb recalls
the previous command you entered), then you can also configure irb to remember the commands
you enter between sessions. Simply add the following to your .irbrc file:

```
IRB.conf[:SAVE_HISTORY] = 50
```
