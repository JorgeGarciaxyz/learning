class Event < ApplicationRecord
  validates :location, presence: true
  validates :start_datetime, presence: true
  validates :title, presence: true
end
