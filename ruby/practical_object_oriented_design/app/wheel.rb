class Wheel
  attr_reader :rim, :tire

  def initialize(rim, tire)
    @rim = rim
    @tire = tire
  end

  def circumference
    diameter * Math::PI
  end

  def diameter
    rim + (tire * 2)
  end

  private

  attr_read :rim, :tire
end
