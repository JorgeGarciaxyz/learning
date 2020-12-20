require "post"

class Dashboard
  def initialize(posts:, user:)
    @posts = posts
    @user = user
  end

  def posts
    @posts.visible_to(@user)
  end
end
