# Regular expressions

I dont know a shit about this

## Ruby's regular expressions

The most common way to write reg exp is to write it between forward slashes.

```
/cat/ matches "dog and cat" but not "Cat"
/123/ matches 3453123 but not 1.23
```

If you want to match one of the special characters litrally in a pattern, precede it with a backslash so /\*/ is a pattern that matches a single asterisk and /\// is a pattern that matches a forward slash.

## Matching Strings with patterns

The ruby operator `=~` matches a string against a pattern. It returns the character offset into the string at whioch the match ocurrred:

```ruby
/cat/ ~= "dog and cat" # => 8
/cat/ ~= "catch" # => 0
/cat/ ~= "Cat" # => nil

# Youy can put the string first
"dog and cat" ~= /cat/ # => 8
```

YOu can test to see a pattern does not match a string using `!~`

```ruby
/cat/ != "Cat" # => true
```

## Changing Strings with Patterns

The sub method takes a pattern and some replacement text. If it finds a match for the string, it replaces the matched substring with the replacement text.

```ruby
str = "Dog and Cat"
new_str = str.sub(/Cat/, "Gerbil")

new_str # => Dog and Gerbil
```

The sub method changes only the first match if finds. To replace all matches, use gsub.

Bot of these method return a new string. (If no substitutions are made, that new string will just be a copy of the original.)

If you want to modify the original string, use sub! and gsub!

WIP (to be continued)
