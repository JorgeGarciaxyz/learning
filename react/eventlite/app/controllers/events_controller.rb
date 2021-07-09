class EventsController < ApplicationController
  def index
    @events = Event.order(start_datime: :asc)
  end
end
