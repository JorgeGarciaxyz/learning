# Chapter 14 Debugger

## Ruby Debugger

Ruby comes with a debugger included into the base system.
You can run the debugger by invoking the interpreter with the -r debug option.

`ruby -r debug ‹ debug-options › ‹ programfile › ‹ program-arguments ›`

The debugger supports:
- Breakpoints
- step into/over metho calls
- display stack frames and variables

## Editor support

You can run ruby using your editor, for example using vi `:%!ruby` which replaces the
program text with its output or `:w_!ruby` which displays the output without affecting
the buffer.
