puts 'Meep'

3 + 2

2*3

1 > 2

value = 1

value == 1

def hello(name)
  puts "hello #{name}"
end

hello('jorge')

for i in 0..2
  hello(i)
end

class Repo
  attr_accessor :name # getter and setters

  def initialize(name)
    @name = name
  end

  def is_rails_repo?
    if @name == 'rails'
      puts 'it is rails'
    else
      puts 'is not rails'
    end
  end
end

# explain that Repo is the class and .name is the methods
