class Movie
  # Price Code Constants
  REGULAR = 0
  NEW_RELEASE = 1

  attr_reader :title
  attr_accessor :price_code

  def initialize(title, price_code)
    @title, @price_code = title, price_code
  end

  def rental_point
    case price_code
    when REGULAR
      1
    when NEW_RELEASE
      2
    end
  end
end

class Rental
  attr_reader :movie, :days_rented

  def initialize(movie, days_rented)
    @movie, @days_rented = movie, days_rented
  end

  def rental_point
    result = 0

    result += movie.rental_point
    result += days_rented_points
  end

  def days_rented_points
    if days > 2
      movie.price_code == Movie::NEW_RELEASE ? days_rented + 2 : days_rented +1
    else
      0
    end
  end
end
