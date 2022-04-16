import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'

const formatDate = datetime =>
  new Date(datetime).toDateString()

function Event(props){
  // This is called array destructuring. It means that useState returns two values
  // and we set event equal to the first returned value and setEvent to the second returned
  // value.
  //
  // Note: useState always replace the variable instead of merging it.
  // Note 2: You can not accept a callback function as a second argument.
  const [event, setEvent] = useState({});
  const currentUser = localStorage.getItem('user')
  let { id } = useParams();

  // By using this Hook, you tell React that your component needs to do
  // something (cause an effect) after rendering the component.
  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3001/api/v1/events/${id}`,
      headers: JSON.parse(currentUser)
    }).then((response) => {
      setEvent(response.data)
    })
  }, [id])// We tell react we only want to run the effect once on mounting the Event component
  // and then clean up any memory usage after it unmounts.
  // We are supposed to include any variables inside this array to tell React to run the
  // effect only when these variables change.

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

export default Event
