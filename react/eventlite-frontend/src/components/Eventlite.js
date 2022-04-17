import React, { useState, useEffect } from 'react';
import axios from "axios";
import EventForm from "./EventForm";
import EventsList from "./EventsList";
import'./Eventlite.css'

function Eventlite(props) {
  const currentUser = localStorage.getItem("user");
  const [events, setEvents] = useState([]);

  useEffect(() =>{
    axios({
      method: 'GET',
      url: 'http://localhost:3001/api/v1/events'
    }).then(response => {
      setEvents(response.data)
    })
  }, [])

  const addNewEvent = (event) => {
    const eventsOrdered = [event, ...events].sort(function (a, b) {
      return new Date(a.start_datetime) - new Date(b.start_datetime);
    });
    setEvents(eventsOrdered)
  };

  return (
    <div>
      {currentUser &&
        <EventForm onSuccess={addNewEvent} />
      }

      <EventsList events={events} />
    </div>
  )
}

export default Eventlite
