# Ep 1 pilot

## Removing code comments and the tradeoffs of where to put variables

```ruby
class Access < ActiveRecord::Base
  after_destroy :reconnect_user
  after_destroy_commit :remove_inaccesible_records

  private

  def reconnect_user
  # ...
  end

  def remove_inaccessible_records
    # 30s of forgiveness in case of accidental removal
    Person::RemoveInaccesibleRecordsJob.set(wait: 30.seconds).perform_later
  end
end
```

We can get rid of the comment introducing explaining variable

```ruby
def remove_inaccessible_records
  grace_period_for_removing_inaccessible_records = 30.seconds
  Person::RemoveInaccesibleRecordsJob.set(
    wait: grace_period_for_removing_inaccessible_records
  ).perform_later
end
```

But we dont wanna define this variable each time we get into the method, so we can create
a constant

```ruby
class Access < ActiveRecord::Base
  GRACE_PERIOD_FOR_REMOVING_INACCESSIBLE_RECORDS = 30.seconds
end
```

The problem with this: we dont need that variable on the public scope nor use it
somewhere else, so we can move it to the private scope

```ruby
class Access < ActiveRecord::Base
  private

  GRACE_PERIOD_FOR_REMOVING_INACCESSIBLE_RECORDS = 30.seconds

  def reconnect_user; end

  def remove_inaccessible_records; end
end
```

We can move the variable just below the `reconnect_user` method but it would look odd.
The tradeoff is to leave it there or switch the `remove_inaccessible_records` position
to the `reconnect_user` to have the position in a more meaningful way.

## Moving methods to rails source code

```ruby
module Account::Administered
  extend ActiveSupport::Concern

  included do
    has_many :administratorships, dependent: :delete_all do
      def grant(person)
        create! person: person
      rescue ActiveRecord::RecordNotUnique
        # don't worry about dupes
        where(person: person).take
      end
    end
  end
end
```

What are we trying to do here is to kinda replicate the behaviour of `find_or_create_by`.

But we can't use this as this is not executed on a transaction block, so a user can be
created on the `create` statement, this is more common on apps with lots of usage like
basecamp.

What we need is the exact opposite `create_or_find_by`, this is a method DHH added to
rails.
