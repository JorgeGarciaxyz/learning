require "user"

class Post < ActiveRecord::Base
  belongs_to :user

  validates :title, presence: true

  def self.today
    where(
      "posts.created_at >= ? AND posts.created_at <= ?",
      Time.now.beginning_of_day,
      Time.now.end_of_day
    )
  end

  def self.visible_to(user)
    where(
      "posts.published = :true OR posts.user_id = :author",
      true: true,
      author: user
    )
  end
end
