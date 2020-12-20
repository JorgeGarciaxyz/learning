require "spec_helper"
require "post"

describe Post do
  describe "#today" do
    it "returns posts created today" do
      create :post, title: "first_today", created_at: Time.now.beginning_of_day
      create :post, title: "last_today", created_at: Time.now.end_of_day
      create :post, title: "yesterday", created_at: 1.day.ago.end_of_day

      result = Post.today

      expect(result.map(&:title)).to match_array(%w(first_today last_today))
    end
  end

  describe "#visible_to" do
    it "returns published posts" do
      author = create(:user)
      viewer = create(:user)
      create :post, user: author, published: true, title: "published_one"
      create :post, user: author, published: true, title: "published_two"
      create :post, user: author, published: false, title: "unpublished"

      result = Post.visible_to(viewer)

      expect(result.map(&:title)).
        to match_array(%w(published_one published_two))
    end

    it "returns unpublished posts authored by the given user" do
      other_user = create(:user)
      viewer = create(:user)
      create :post, user: viewer, published: false, title: "viewer_one"
      create :post, user: viewer, published: false, title: "viewer_two"
      create :post, user: other_user, published: false, title: "other_user"

      result = Post.visible_to(viewer)

      expect(result.map(&:title)).to match_array(%w(viewer_one viewer_two))
    end
  end

  around do |example|
    Timecop.freeze { example.run }
  end
end

