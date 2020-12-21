# Test Doubles / Verifying Expectations With Spies

Hey there! We're [thoughtbot](https://thoughtbot.com), a design and
development consultancy that brings your digital product ideas to life.
We also love to share what we learn.

This coding exercise comes from [Upcase](https://thoughtbot.com/upcase),
the online learning platform we run. It's part of the
[Test Doubles](https://thoughtbot.com/upcase/test-doubles) course and is just one small sample of all
the great material available on Upcase, so be sure to visit and check out the rest.

## Exercise Intro

Mocks allow us to verify that our doubles receive messages as expected, but they muddle up our tests by setting expectations out of order:

``` ruby
describe PostsController  do
  describe "#edit" do
    it "redirects to the created post when published" do
      # Setup
      post = create(:post)
      allow(post).to receive(:published?).and_return(true)
      attributes = { "title" => "example" }

      # Setup? Verification? Both?
      expect(Post).to receive(:create).with(attributes).and_return(post)

      # Exercise
      post :create, post: attributes

      # Verification
      expect(response).to redirect_to(post_url(post))
    end
  end
end
```

As you can see, the mocks merge the verification steps into the setup, making it harder to understand exactly what's being tested.

They also make it more difficult to extract useful methods for test setup:

``` ruby
it "redirects to the edit page when unpublished" do
  post = create(:post)
  allow(post).to receive(:published?).and_return(false)
  allow(Post).to receive(:create).and_return(post)

  post :create, post: {}

  expect(response).to redirect_to(edit_post_url(post))
end
```

This spec has a very similar setup to the first, but we can't easily extract a method without also re-verifying the behavior from the first test, which would be over-testing.

This is where test spies become useful. With a spy, you first create a stub (using `allow`), and then verify it after the exercise (using `expect`). Rewriting the first example using a spy makes it much clearer:

``` ruby
describe PostsController  do
  describe "#edit" do
    it "redirects to the created post when published" do
      # Setup
      post = create(:post)
      allow(post).to receive(:published?).and_return(true)
      allow(Post).to receive(:create).and_return(post)
      attributes = { "title" => "example" }

      # Exercise
      post :create, post: attributes

      # Verification
      expect(Post).to have_received(:create).with(attributes)
      expect(response).to redirect_to(post_url(post))
    end
  end
end
```

Using spies also makes it easier to extract repeated setup steps, because the verification steps are separate:

``` ruby
describe PostsController  do
  describe "#edit" do
    it "redirects to the created post when published" do
      post = stub_created_post(published?: true)
      attributes = { "title" => "example" }

      post :create, post: attributes

      expect(Post).to have_received(:create).with(attributes)
      expect(response).to redirect_to(post_url(post))
    end

    it "redirects to the edit page when unpublished" do
      post = stub_created_post(published?: false)

      post :create, post: {}

      expect(response).to redirect_to(edit_post_url(post))
    end
  end

  def stub_created_post(published:)
    create(:post).tap do |post|
      allow(post).to receive(:published?).and_return(published)
      allow(Post).to receive(:create).and_return(post)
    end
  end
end
```

In this exercise, you'll rewrite the `Signup` specs again, this time using spies instead of mocks.

## Instructions

To start, you'll want to clone and run the setup script for the repo

    git clone git@github.com:thoughtbot-upcase-exercises/verifying-expectations-with-spies.git
    cd verifying-expectations-with-spies
    bin/setup

After running `bin/setup`, edit `spec/signup_spec.rb` and refactor the tests to use stubs and spies, using `allow`, `expect`, and `have_received`.

After refactoring both tests, look to see if there are any methods you can extract to factor out similar setup.

## Tips and Tricks

Useful links:

- Check out our Weekly Iteration episode on [Stubs, Mocks, Spies, and Fakes](https://upcase.com/videos/stubs-mocks-spies-and-fakes).
- Check out the rspec-mocks guide to [test spies](https://github.com/rspec/rspec-mocks#test-spies).

## Featured Solution

Check out the [featured solution branch](https://github.com/thoughtbot-upcase-exercises/verifying-expectations-with-spies/compare/featured-solution#toc) to
see the approach we recommend for this exercise.

## Forum Discussion

If you find yourself stuck, be sure to check out the associated
[Upcase Forum discussion](https://forum.upcase.com/t/test-doubles-verifying-expectations-with-spies/4612)
for this exercise to see what other folks have said.

## Next Steps

When you've finished the exercise, head on back to the
[Test Doubles](https://thoughtbot.com/upcase/test-doubles) course to find the next exercise,
or explore any of the other great content on
[Upcase](https://thoughtbot.com/upcase).

## License

verifying-expectations-with-spies is Copyright © 2015-2018 thoughtbot, inc. It is free software,
and may be redistributed under the terms specified in the
[LICENSE](/LICENSE.md) file.

## Credits

![thoughtbot](https://presskit.thoughtbot.com/assets/images/logo.svg)

This exercise is maintained and funded by
[thoughtbot, inc](http://thoughtbot.com/community).

The names and logos for Upcase and thoughtbot are registered trademarks of
thoughtbot, inc.
