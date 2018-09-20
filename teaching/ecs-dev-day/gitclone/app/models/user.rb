class User < ApplicationRecord
  validates :email, :name, presence: true

  has_many :repos
end
