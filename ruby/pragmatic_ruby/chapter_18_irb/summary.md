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
