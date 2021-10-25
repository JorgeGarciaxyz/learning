import React from "react";
import ReactDOM from "react-dom";

import EventsList from "./EventsList";
import EventForm from "./EventForm";

class Eventlite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: this.props.events,
      title: "",
      start_datetime: "",
      location: "",
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
        this.addNewEven(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <EventForm
          handleSubmit={this.handleSubmit}
          handleInput={this.handleInput}
          title={this.state.title}
          start_datetime={this.state.start_datetime}
          location={this.state.location}
        />
        <EventsList events={this.props.events} />
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
