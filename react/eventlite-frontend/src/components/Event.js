import axios from 'axios';
import React, { Component } from 'react';

const formatDate=datetime=>
  new Date(datetime).toDateString()

class Event extends Component {
  constructor(props) {
    super(props)
     this.state = {
      event: {}
    }
  }
  componentDidMount () {
    // I couldnt find how to pass URL props to class component
    axios({
      method: 'GET',
      url: `http://localhost:3001/api/v1/events/1`,
      headers: JSON.parse(localStorage.getItem('user'))
    }).then((response) => {
      this.setState({event: response.data})
    })
   }

  render() {
     return (
      <div className="event">
        <h2 className='event-title'>{this.state.event.title}</h2>
        <div className='event-datetime'>
          {formatDate(this.state.event.start_datetime)}
        </div>
        <div className='event-location'>{this.state.event.location}</div>
      </div>
    );
  }
}

export default Event;
