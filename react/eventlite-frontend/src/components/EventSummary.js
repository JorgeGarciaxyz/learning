import React from 'react'
import PropTypes from'prop-types'
import { Link } from 'react-router-dom'

const formatDate = datetime =>
  new Date(datetime).toDateString()

const EventSummary = props => (
  <div className="event">
    <Link to={`/events/${props.event.id}`} style={{textDecoration: 'none', colot: 'black'}}>
      <h2 className="event-title">{props.event.title}</h2>
    </Link>
  </div>
)

Event.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    start_datetime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  })
}

export default EventSummary
