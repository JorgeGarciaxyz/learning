require "rspec"
require "active_record"
require "database_cleaner"
require "factory_girl"
require "timecop"

PROJECT_ROOT = File.expand_path("../..", __FILE__)

$LOAD_PATH << PROJECT_ROOT

ActiveRecord::Base.establish_connection(
  adapter:  "sqlite3",
  database: File.join(PROJECT_ROOT, "test.db")
)

class CreateSchema < ActiveRecord::Migration
  def self.up
    create_table :posts, force: true do |table|
      table.string :title
      table.boolean :published, default: false
      table.integer :user_id
      table.timestamps
    end

    create_table :users, force: true do |table|
      table.string :username
      table.timestamps
    end
  end
end

FactoryGirl.define do
  sequence(:title) { |n| "title#{n}text" }
  sequence(:username) { |n| "user#{n}name" }

  factory :post do
    title
    user
  end

  factory :user do
    username
  end
end

RSpec.configure do |config|
  config.include FactoryGirl::Syntax::Methods

  config.before(:suite) do
    CreateSchema.suppress_messages { CreateSchema.migrate(:up) }
    DatabaseCleaner.clean_with :deletion
    DatabaseCleaner.strategy = :transaction
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
