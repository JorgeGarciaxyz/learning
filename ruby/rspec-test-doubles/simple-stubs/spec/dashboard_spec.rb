require "spec_helper"
require "dashboard"

describe Dashboard do
  describe "#todays_posts" do
    it "returns posts created today" do
      posts = double("today posts")

      expect(Post).to receive(:today).and_return(posts)

      dashboard = Dashboard.new(posts: Post.all)

      expect(dashboard.todays_posts).to eq(posts)
    end
  end

  around do |example|
    Timecop.freeze { example.run }
  end
end
