# Lesson #3 Using globals when the price is right

This is handled by `ActiveSupport::CurrentAttributes`.

```ruby
class Current < ActiveSupport::CurrentAttributes
  attribute :account, :person
  attribute :request_id, :user_agent, :ip_address

  delegate :user, :integration, to: :person, allow_nil: true
  delegate :identity, to: :user, allow_nil: true

  resets { Time.zone = nil }

  def person=(person)
    super
    self.account = person.try(:account)
    Time.zone    = person.try(:time_zone)
  end
end
```

On the application controller..

```ruby
class ApplicationController
  include SetCurrentRequestDetails
end

module SetCurrentRequestDetails
  extend ActiveSupport::Concern

  included do
    before_action do
      Current.request_id = request.uuid
      Current.user_agent = request.user_agent
      Current.ip_address = request.ip
    end
  end
end
```

Then the authentication is handled by authenticate concerns

```ruby
def authenticated(user, by:)
  benchmark "#{authentication_identification(user)} by #{by}" do
    set_authenticated_by(by)
    @authenticated_user = user
    Current.person = user.person
  end
end
```

There is a feature on basecamp called Track Events, they use the globals in this way
```ruby
module Recording::Eventable
  extend ActiveSupport::Concern

  included do
  # ...
  end

  def track_event(action, recordable_previous: nil, **particulars)
    Event.create! \
      recording: self, recordable: recordable, recordable_previous: recordable_previous,
      bucket: bucket, creator: Current.person, action: action,
      detail: Event::Detail.new(particulars)
  end
```

Event model, this uses the `requested` mixin, when the event is created, we want to know
which person create the event.

```ruby
class Event< ActiveRecord::Base
  # ...
  include Notifiable, Relaying, RecordabeGid, Requested, Summarizable, Catogorized... #
  include Firehoseable
end

module Event::Requested
  extend ActiveSupport::Concern

  included do
    has_one :request, dependent: :delete, required: true
    before_validation :build_request, on: :create
  end
end

class Event::Request < ActiveRecord::Base
  belongs_to :event
  before_create :set_from_current

  private

  def set_from_current
    self.guid       ||= Current.request_id
    self.user_agent ||= Current.user_agent
    self.ip_address ||= Current.ip_address
  end
end
```
