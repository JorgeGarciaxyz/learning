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
