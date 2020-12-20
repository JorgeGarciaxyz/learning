# Test Doubles / Stubs With Constraints

Hey there! We're [thoughtbot](https://thoughtbot.com), a design and
development consultancy that brings your digital product ideas to life.
We also love to share what we learn.

This coding exercise comes from [Upcase](https://thoughtbot.com/upcase),
the online learning platform we run. It's part of the
[Test Doubles](https://thoughtbot.com/upcase/test-doubles) course and is just one small sample of all
the great material available on Upcase, so be sure to visit and check out the rest.

## Exercise Intro

When stubbing out a method, sometimes the arguments to that method are important for producing the correct result. For example, you may want to make sure a query has a `LIMIT` clause set on it:

``` ruby
Post.limit(per_page)
```

This stub won't be enough:

``` ruby
allow(Post).to receive(:limit).and_return(posts)
```

Calling `limit` with a different number (or even no number at all!) would still cause this test to pass. You need to set a constraint on the arguments:

``` ruby
allow(Post).to receive(:limit).with(10).and_return(posts)
```

In this exercise, you'll use `with` in order to test methods with important arguments.

## Instructions

To start, you'll want to clone and run the setup script for the repo

    git clone git@github.com:thoughtbot-upcase-exercises/stubs-with-constraints.git
    cd stubs-with-constraints
    bin/setup

After running `bin/setup`, edit `spec/dashboard_spec.rb` and use `double`, `allow`, and `with` to clean up test logic duplicated from `spec/post_spec.rb`.

## Tips and Tricks

Useful links:

- Check out our Weekly Iteration episode on [Stubs, Mocks, Spies, and Fakes](https://upcase.com/videos/stubs-mocks-spies-and-fakes)
- Check out the rspec-mocks [guide to expecting arguments](https://github.com/rspec/rspec-mocks#expecting-arguments)

## Featured Solution

Check out the [featured solution branch](https://github.com/thoughtbot-upcase-exercises/stubs-with-constraints/compare/featured-solution#toc) to
see the approach we recommend for this exercise.

## Forum Discussion

If you find yourself stuck, be sure to check out the associated
[Upcase Forum discussion](https://forum.upcase.com/t/test-doubles-stubs-with-constraints/4610)
for this exercise to see what other folks have said.

## Next Steps

When you've finished the exercise, head on back to the
[Test Doubles](https://thoughtbot.com/upcase/test-doubles) course to find the next exercise,
or explore any of the other great content on
[Upcase](https://thoughtbot.com/upcase).

## License

stubs-with-constraints is Copyright © 2015-2018 thoughtbot, inc. It is free software,
and may be redistributed under the terms specified in the
[LICENSE](/LICENSE.md) file.

## Credits

![thoughtbot](https://presskit.thoughtbot.com/assets/images/logo.svg)

This exercise is maintained and funded by
[thoughtbot, inc](http://thoughtbot.com/community).

The names and logos for Upcase and thoughtbot are registered trademarks of
thoughtbot, inc.
