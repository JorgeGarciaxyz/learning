import axios from 'axios';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom'

const formatDate = datetime =>
  new Date(datetime).toDateString()

function Eevent(props){
  // This is called array destructuring. It means that useState returns two values
  // and we set event equal to the first returned value and setEvent to the second returned
  // value.
  const [event, setEvent] = useState({});
  const currentUser = localStorage.getItem('user')
  let { id } = useParams();

  return(
    <div className='event'>
      {currentUser && <Link to={`/events/${id}`}>Edit</Link>}

      <h2 className='event-title'>{event.title}</h2>
      <div className='event-datetime'>
        {formatDate(event.start_datetime)}
      </div>
      <div className='event-location'>{event.location}</div>
      <div className='event-description'>{event.description}</div>
    </div>
  )
}

export default Eevent
