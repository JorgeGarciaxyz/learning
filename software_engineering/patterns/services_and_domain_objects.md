# Services and Domain Objects

Initial reading: [Beware of service objects](https://www.codewithjason.com/rails-service-objects/)

Jason talks about the problems of encapsulating business logic in individual service objects.

This is backed by [Martin Fowler's "Anemic Domain Model"](https://martinfowler.com/bliki/AnemicDomainModel.html)

TLDR of Fowler's article:
- Objects named after nouns in the domain space and these are conected with the structure
  that domain models have
- The set of sevice objects capture all the domain logic
- The fundamental horror of this anti-pattern is that it's so contrary to the basic idea
  of object-oriented design; which is to combine data and process together
- In general, the more behavior you find in the services, the more likely you are to be
  robbing yourself of the benefits of a domain model. If all your logic is in services, you've robbed yourself blind.

## Example of Anemic Domain Model

The next service represent a domain called "combined feed" which wraps two models of the
application (article and news_post)

```ruby
class GetCombinedFeedService
  attr_reader :collection

  def initialize(organization_id)
    @organization_id = organization_id
    @collection = collection
  end

  def collection
    Article.where(organization_id: @organization_id) +
    NewsPost.where(organization_id: @organization_id)
  end
end
```

Following the principle of an anemic domain model, we want to decorate the data:

```ruby
class DecorateCombinedFeedService
  def initialize(organization_id)
    @organization_id = organization_id
    @collection = collection
  end

  def collection
    CombinedFeedDecorator.decorate_all(
      GetLatestCombinedFeedService.new(@organization_id).collection
    )
  end
end
```

And for each new functionality we want to add, we keep creating new services that end up
using only getters and setters and contain no logic at all.

## Example of a Domain Model

Same problem as the previous example

```ruby
class CombinedFeed
  attr_reader :all

  def initialize(organization_id)
    @organization_id = organization_id
    @all = base_collection
  end

  def decorate
    CombinedFeedDecorator.decorate_all(all)
  end

  private

  def base_collection
    Article.where(organization_id: @organization_id) +
    NewsPost.where(organization_id: @organization_id)
  end
end
```

notes: @benoror was the OG creator of this domain model
