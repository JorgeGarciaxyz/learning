import React from "react";
import ReactDOM from "react-dom";
import PropTypes from'prop-types'

import axios from "axios";

import EventForm from "./EventForm";
import EventsList from "./EventsList";
import FormErrors from "./FormErrors";

import validations from "../validations";

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

  static formValidations = {
    title: [
      (value) => { return(validations.checkMinLength(value, 3)) }
    ],
    start_datetime: [
      (value) => { return(validations.checkMinLength(value, 1)) },
      (value) => { return(validations.timeShouldBeInTheFuture(value)) }
    ],
    location: [
      (value) => { return(validations.checkMinLength(value, 1)) }
    ]
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
    const value = e.target.value
    const newState = {};

    newState[name] = {...this.state[name], value: e.target.value };
    // You can send an optional callback to the setState method to execute a subsequent
    // method after the state is updated.
    this.setState(
      newState, () => this.validateField(name, value, Eventlite.formValidations[name] )
    )
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
    this.setState({
      formValid: this.state.title.valid && this.state.location.valid && this.state.start_datetime.valid
    });
  }

  validateField(fieldName, fieldValue, fieldValidations) {
    let fieldError = '';

    let fieldValid = true;
    let errors = fieldValidations.reduce((errors, validation) => {
      let [valid, fieldError] = validation(fieldValue);
      if (!valid) {
        errors = errors.concat([fieldError]);
      }
      return(errors);
    }, []);

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

Eventlite.propTypes = {
  events: PropTypes.array.isRequired
}

document.addEventListener("DOMContentLoaded", () => {
  const node = document.getElementById("events_data");
  const data = JSON.parse(node.getAttribute("data"));

  ReactDOM.render(
    <Eventlite events={data} />,
    document.body.appendChild(document.createElement("div"))
  );
});
