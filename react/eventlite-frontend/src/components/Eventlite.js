import React from "react";

import axios from "axios";

import EventForm from "./EventForm";
import EventsList from "./EventsList";

import validations from "../validations";

import'./Eventlite.css'

class Eventlite extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: []
    }
  }

  componentDidMount() {
    axios({
      method: 'GET',
      url: 'http://localhost:3001/api/v1/events'
    }).then(response => {
      this.setState({events: response.data})
    })
  }


  addNewEvent = (event) => {
    const events = [event, ...this.state.events].sort(function (a, b) {
      return new Date(a.start_datetime) - new Date(b.start_datetime);
    });

    this.setState({ events: events }, this.changeLogoColour);
  };

  changeLogoColour = () => {
    const colors = ["red", "blue", "green", "violet"];
    this.logo.current.style.color = colors[Math.floor(Math.random() * colors.length)]
  };

  render() {
    const currentUser = localStorage.getItem("user");

    return (
      <div>
        {currentUser &&
          <EventForm onSuccess={this.addNewEvent} />
        }

        <EventsList events={this.state.events} />
      </div>
    );
  }
}

export default Eventlite;
