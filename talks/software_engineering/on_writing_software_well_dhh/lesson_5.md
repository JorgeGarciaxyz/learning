# Lesson 5: Testing without test damage or excessive isolation

[Link](https://www.youtube.com/watch?v=5hN6OZDyQtk&list=PL9wALaIpe0Py6E_oHCgTrD6FvFETwJLlx&index=5)

Tags: models, concerns, controllers, tests

## Testing philosophy

Not using unit test that can run in miliseconds at the cost of mocks and stubs.

In majority of cases is better to test the real thing, interactions with the database,
models, controllers and templates, doesn't matter if this cost more time.

The objective of software is not having fast and isolated test, the objective is having
confident software that doesn't break.

## TDD thoughts

[Is TDD dead? DHH, Fowler and Beck](https://www.youtube.com/watch?v=z9quxZsLcfo)
[RailsConf 2014, Writing software by DHH](https://www.youtube.com/watch?v=9LfmrkyP81M)
[TDD is dead. Long live testing](https://dhh.dk/2014/tdd-is-dead-long-live-testing.html)

## The code

Testing features in basecamp

```ruby
# Document model

class Document < ActiveRecord::Base
  include Recordable, RichText, PlainText

  def title
    super.presence || 'Untitled'
  end

  def auto_position?
    true
  end

  def subscribable?
    true
  end

  def exportable?
    true
  end

  def exportable_filename
    ActiveStorage::Filename.new("#{title.strip}.html")
  end
end
```

```ruby
module Recording::Subscribable
  extend ActiveSupport::Concern

  included do
    has_many :subscriptions, dependent: :delete_all
    has_many :subscribers, through: :subscriptions

    after_create { subscribe(creator) if subscribable? }
  end

  def subscribable?
    recordable.subscribable?
  end
end
```

Recording model

```ruby
class Recording < ActiveRecord::Base
  include Lockable # we will focus on this

  include Eventable
  include Assignable
  include Completable
end
```

The record can have a lock and when the user edits the recording is locked to prevent
updates.

```ruby
module Recording::Lockable
  extend ActiveSupport::Concern

  included do
    has_one :lock, dependent: :destroy
  end

  def lock_by(user)
    transaction do
      create_lock! user: user unless locked?
    end
  end

  def locked?
    lock.present?
  end

  def locked_by?(user)
    locked? && lock.user == user
  end

  def unlock
    update! lock: nil
  end
end
```
