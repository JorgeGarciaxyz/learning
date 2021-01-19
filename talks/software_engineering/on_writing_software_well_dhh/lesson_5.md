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

Document model test

```ruby
class DocumentTest < ApplicationModelTest
  setup { Current.person = people('37s_david') }

  test 'create document with first version' do
    recording = buckets(:anniversary).record Document.new(title: 'Funk', content: 'Town')
    document  = recording.recordable

    assert_equal 'Funk', document.title
    assert_equal 'Town', document.content
  end

  test 'updating a document will keep the old version around through past recordables' do
    recording = buckets(:anniversary).record Document.new(title: 'Funk', content: 'Town')

    travel 5.seconds

    recording.update! recordable: Document.new(title: 'Nerw order', content: 'This first')

    current_document = recording.reload.recordable_versions.first

    assert_equal 'New order', current_document.title
    assert_equal 'This first', current_document.content.to_s
  end
end
```

`Recording::Lockable` concern test

```ruby
class Recording::LockTest < ApplicationModelTest
  setup { Current.person = people('37s_david') }

  test 'locking a recording' do
    recordings(:planning_document).lock_by(users('37s_david'))
    assert recordings(:planning_document).locked?
    assert_equal users('37s_david'), recordings(:planning_document).lock.user
  end

  test 'trying to lock an already locked recording will fail' do
    assert recordings(:planning_document).lock_by(users('37s_david'))

    assert !recordings(:planning_document).lock_by(users('37s_david'))
  end

  test 'unlock a recording' do
    recordings(:planning_document).lock_by users('37s_david')
    assert recordings(:planning_document).locked?

    recordings(:planning_document).unlock
    assert !recordings(:planning_document).locked?
  end

  test 'recording was locked by the user viewing the lock' do
    recordings(:planning_document).lock_by users('37s_david')
    assert recordings(:planning_document).lock_by?(users('37s_david'))
  end
end
```

## Controllers

```ruby
class DocumentsController < ApplicationController
  include SetRecordable, VaultScoped, BucketScoped
  include LockRecording
  include Subscribers, RecordingStatusParam

  def create
    @recording = @bucket.record new_document, parent: @vault, status: status_param, subscribers: find_subscribers

    respond_to do |format|
      format.any(:html, :js) { redirect_to edit_subscriptions_or_recordable_url(@recording) }
      format.json { render :show, status: :created }
    end
  end

  private

  def new_document
    Document.new params.require(:document).permit(:title, :content)
  end
end
```

Document controller test

```ruby
class DocumentsControllerTest < ActionDispatch::IntegrationTest
  setup { sign_in_as '37s_david' }

  test 'creating a new document' do
    get new_bucket_vault_document_url(buckets(:anniversary), recordings(:anniversary_vault))
    assert_response :ok
    assert_breadcrumbs "Docs & Files"

    post bucket_vault_documents_url(buckets(:anniversary), recordings(:anniversary_vault)), params: {
      document: { title: 'Meep', content: 'Yes yes'
    }

    follow_redirect!
    assert_select 'h1', /Meep/
  end
end
```
