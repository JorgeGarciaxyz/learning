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
      location: { value: "", valid: false},
      title: { value: "", valid: false},
      start_datetime: { value: "", valid: false},
      formValid: false,
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

    newState[name] = {...this.state[name], value: e.target.value };
    // You can send an optional callback to the setState method to execute a subsequent
    // method after the state is updated.
    this.setState(newState, this.validateForm);
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let newEvent = {
      title: this.state.title.value,
      start_datetime: this.state.start_datetime.value,
      location: this.state.location.value
    };

    axios({
      method: "POST",
      url: "/events",
      data: { event: newEvent },
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

  validateForm() {
    let formErrors = {};
    let formValid = true

    if(this.state.location.value.length === 0) {
      formErrors.location = ["Can't be blank"];
      formValid = false;
    }

    if(this.state.title.value.length <= 2) {
      formErrors.title = ["Tittle is too short (minimum is 3 characters)"];
      formValid = false;
    }

    if (this.state.start_datetime.value.length === 0) {
      formErrors.start_datetime = ["Can't be blank"]
      formValid = false;
    } else if (Date.parse(this.state.start_datetime.value) <= Date.now()) {
      formErrors.start_datetime = ["Can't be in the past"];
      formValid = false;
    }

    this.setState(
      { formValid: formValid, formErrors: formErrors }
    );
  }

  validateField(fieldName, fieldValue) {
    let fieldValid = true;
    let errors = []
    switch(fieldName) {
      case "title":
      if(fieldValue.length <= 2) {
        // Concat returns a new array wihtout mutating the original one which is more
        // efficient.
        errors = errors.concat(["is too short (minimum is 3 characters)"]);
        fieldValid = false;
      }
      break;

      case "location":
      if(fieldValue.length === 0) {
        errors = errors.concat(["can't be blank"])
        fieldValid = false
      }
      break;

      case 'start_datetime':
      if(fieldValue.length === 0) {
        errors = errors.concat(["can't be blank"])
        fieldValid = false
      } else if(Date.parse(fieldValue) <= Date.now()) {
        errors = errors.concat(["can't be in the past"])
        fieldValid = false
      }
      break;
    }

    const newState = { formErrors: {...this.state.formErrors, [fieldName]: errors } };
    newState[fieldName] = {...this.state[fieldName], valid: fieldValid };
    this.setState(newState, this.validateForm);
  }

  render() {
    return (
      <div>
        <FormErrors formErrors={this.state.formErrors} />
        <EventForm
          formValid={this.state.formValid}
          handleSubmit={this.handleSubmit}
          handleInput={this.handleInput}
          title={this.state.title.value}
          start_datetime={this.state.start_datetime.value}
          location={this.state.location.value}
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
