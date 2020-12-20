require "spec_helper"
require "dashboard"

describe Dashboard do
  describe "#posts" do
    it "returns posts visible to the current user" do
      user = double("user")

      posts = double("posts")
      user_posts = double("user_posts")

      dashboard = Dashboard.new(posts: posts, user: user)

      allow(posts).to receive(:visible_to).with(user).and_return(user_posts)

      expect(dashboard.posts).to eq(user_posts)
    end
  end
end
