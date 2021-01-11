## Vim basics

### Cursor location
`G` move to the bottom of the file
`gg` move to the start of the file
`4G` move to line 4

### Delete `d`
`dw` delete from the cursor up to the next word
`d$` from the cursor to the end of a line

### Matching parentheses search
`%` type on any (,[ or { to find the matching parenthesis

### Move shortcuts
`0` move to the start of the line

### Motions
`w` up to the next word
`$` to the end of a line

### Operator
`2w` to repeat a motion prepend with a number

operator [number] motion

`d2w` delete 2 words from the cursor up to the next word

### Replace
`r` type r and then the character which should be there.
`re` change from the cursor to the end of the word
`r$` change from the cursor to the end of the word

### Search
`/` and type the term to search
`n` next word
`N` previous word
`?` search in backward direction
`CTRL-O` to go back where you came

### Undo
`u` undo previous actions
`U` undo all the changes on a line
`CTRL-R` to undo the undo's
