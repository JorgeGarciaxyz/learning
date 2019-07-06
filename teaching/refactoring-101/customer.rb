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
      frequent_renter_points = rental.rental_point
    end

    puts "Your total frequent renter points is #{frequent_renter_points}"
  end
end
