class Event < ApplicationRecord
  belongs_to :user

  validates :location, presence: true
  validates :start_datetime, presence: true
  validates :title, presence: true, length: { minimum: 3 }

  validate :start_datetime_cannot_be_in_the_past

  private

  def start_datetime_cannot_be_in_the_past
    if start_datetime.present? && start_datetime < Time.now
      errors.add(:start_datetime, "can't be in the past")
    end
  end
end
