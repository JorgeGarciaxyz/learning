import React from 'react'
import EventSummary from './EventSummary'
import PropTypes from'prop-types'

const EventsList = props => (
  <div>
    {props.events.map(function(event){
      return(
        <EventSummary key={event.id} event={event} />
      )
    })}
  </div>
)

EventsList.propTypes = {
  events: PropTypes.array.isRequired
}

export default EventsList
