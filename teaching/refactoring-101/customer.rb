class Customer
  attr_reader :name

  def initialize(name)
    @name = name
    @rentals = []
  end

  def add_rental(arg)
    @rentals << arg
  end

  def statement
    frequent_renter_points = 0

    @rentals.each do |rental|
      if rental.movie.price_code == Movie::NEW_RELEASE
        frequent_renter_points += 2
        frequent_renter_points += (rental.days_rented + 2) if rental.days_rented > 2
      else
        frequent_renter_points += 1
        frequent_renter_points += (rental.days_rented + 1) if rental.days_rented > 2
      end
    end

    puts "Your total frequent renter points is #{frequent_renter_points}"
  end
end
