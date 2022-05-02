# Arel

[Link](https://thoughtbot.com/blog/using-arel-to-compose-sql-queries)

- The methods Rails provides to access the underlying Arel interface is `arel_table`.
- This object acts like a hash which contains each column on the table.
  - The columns given by Arel are a type of `Node`

Example:

```ruby
Group.where("private = false OR id IN ?", visitor.group_ids)

# It can be refactored to:
Group.where(
  arel_table[:private].eq(false)
  .or(
    arel_table[:id].in(visitor.group_ids)
  )
)

def arel_table
  Group.arel_table
end

MeterEntry.where((MeterEntry.arel_table[:source].in(["api", "go_app"])))
```
