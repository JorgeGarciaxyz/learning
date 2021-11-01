import React from "react";
import ReactDOM from "react-dom";

import axios from "axios";

import EventForm from "./EventForm";
import EventsList from "./EventsList";
import FormErrors from "./FormErrors";

class Eventlite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: this.props.events,
      formErrors: {},
      location: "",
      title: "",
      start_datetime: "",
    };
  }

  addNewEvent = (event) => {
    const events = [event, ...this.state.events].sort(function (a, b) {
      return new Date(a.start_datetime) - new Date(b.start_datetime);
    });

    this.setState({ events: events });
  };

  handleInput = (e) => {
    e.preventDefault();

    const name = e.target.name;
    const newState = {};

    newState[name] = e.target.value;
    this.setState(newState);
  };

  handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: "/events",
      data: { event: this.state },
      headers: {
        "X-CSRF-Token": document.querySelector("meta[name=csrf-token]").content,
      },
    })
      .then((response) => {
        this.addNewEvent(response.data);
        this.resetFormErrors();
      })
      .catch((error) => {
        this.setState({ formErrors: error.response.data });
      });
  };

  resetFormErrors() {
    this.setState({ formErrors: {} });
  }

  render() {
    return (
      <div>
        <FormErrors formErrors={this.state.formErrors} />
        <EventForm
          handleSubmit={this.handleSubmit}
          handleInput={this.handleInput}
          title={this.state.title}
          start_datetime={this.state.start_datetime}
          location={this.state.location}
        />
        <EventsList events={this.state.events} />
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const node = document.getElementById("events_data");
  const data = JSON.parse(node.getAttribute("data"));

  ReactDOM.render(
    <Eventlite events={data} />,
    document.body.appendChild(document.createElement("div"))
  );
});
