# Ep. 2 Callbacks

## Mentions feature

On the messages controller there are no reference to any mention, we only create messages.

The `Mention` are stored on their own model.

```ruby
class Mention < ActiveRecord::Base
  belongs_to :mentionee, class_name: "Person" # receives the notification
  belongs_to :mentioner, class_name: "Person" # sends the messages

  after_commit :deliver, unless: -> { mentioner == mentionee }, on: [:create, :update]

  # the #deliver uses the class Deliveries::MentionDelivery to send the notifications
  # either notifications or mail
end
```

Mentions are a concern, stored on `recordings` is an encapsultation of all kinds of
content (chat, message, todos, etc.).

The recording creation is encapsulated on the creation of the message.

```ruby
class MessagesController < ApplicationController
  def create
    @recording = @bucket.record new_message, # ... other params
  end
end
```

After the recording is created is now turn of the recording mentions concern

```ruby
module Recording::Mentions
  extend ActiveSupport::Concern

  included do
    has_many :mentions, dependent: :destroy
    after_save :remember_to_eavesdrop
    after_commit :eavesdrop_for_mentions, on: [:create, :update], if: :eavesdropping?
  end

  private

  # we take a look to the changes on the attributes
  def remember_to_eavesdrop
    @eavesdropping = active_or_archived_recordable_changed? || draft_became_active?
  end

  def active_or_archived_recordable_changed?
    (active? || archived?) && saved_change_to_recordable_id?
  end

  def draft_became_active?
    active? && changed_from_drafted?
  end

  def eavesdropping?
    @eavesdropping && !Mention::Eavesdropper.suppressed? && has_mentions?
  end

  def eavesdrop_for_mentions
    Mention::EavesdroppingJob.perform_later self, mentioner: Current.person
  end
end
```

This concern does not contains anything related with how to do the job, is only concern
about: we need to do the job?

The next job do the work:

```ruby
class Mention::EavesdroppingJob < ApplicationJob
  queue_as :background

  def perform(recording, mentioner:)
    Current.set(account: recording.account) do
      Mention::Eavesdropper.new(recording, mentioner: mentioner).create_mentions
    end
  end
end
```

The job is handled by the eavesdropper

```ruby
# Eavesdrop on the recording and call out any mentionees
class Mention::Eavesdropper
  def initialize(recording, mentioner: nil)
    @recording = recording
    @mentioner = mentioner
  end

  def has_mentions?
    mentionees.present?
  end

  def create_mentions
    recording.with_lock do
      mentionees.each do |mentionee, callsign|
        create_mention mentionee, callsign
      end
    end
  end

  private

  def mentionees
    @mentionees ||= Mention::Scanner.new(recording).mentionees_with_callsigns
  end

  def create_mention(mentionee, callsign)
    if recording.versioned_mentions? || !recording.mentions.exists?(mentionee: mentionee)
      recording.mentions.find_or_initialize_by(mentionee: mentionee.tap) do |mention|
        mention.callsign     = callsign
        mentioner.mentioneer = @mentioneer
        mention.updated_at   = Time.now
        mention.save!
      end
    end
  end
end
```

Scanner

```ruby
# app/models/mention/scanner.rb

class Mention::Scanner
  def initialize(recording)
    @recording = recording
  end

  def mentionees
    mentionees_with_callsigns.map(&:first)
  end

  def mentionees_with_callsigns
    plain_text_mentionees | rich_text_mentionees
  end

  # the other logic is either find the mentionees on html or using a regex to find them.
end
```
