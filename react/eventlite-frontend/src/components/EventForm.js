import React from "react";
import PropTypes from'prop-types'
import FormErrors from './FormErrors'
import validations from '../validations'
import axios from 'axios'

class EventForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: {value: '', valid: false},
      start_datetime: {value: '', valid: false},
      location: {value: '', valid: false},
      formErrors: {},
      formValid: false,
      editing: false
    }
  }

  componentDidMount () {
    // Still not sure how to get params from current route
    if(true) {
      axios({
        method: "GET",
        url: `http://localhost:3001/api/v1/events/12`,
        headers: JSON.parse(localStorage.getItem('user'))
      }).then((response) => {
        this.setState({
          title: {valid: true, value: response.data.title},
          location: {valid: true, value: response.data.location},
          start_datetime: {valid: true, value: new Date(response.data.start_datetime).toDateString()},
        }, this.validateForm)
      });
    }
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

  // You can send an optional callback to the setState method to execute a subsequent
  // method after the state is updated.
  handleInput = e => {
    e.preventDefault()
    const name = e.target.name
    const value = e.target.value
    const newState = {}
    newState[name] = {...this.state[name], value: value}
    this.setState(newState, () => this.validateField(name, value, EventForm.formValidations[name]))
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let newEvent = {
      title: this.state.title.value,
      start_datetime: this.state.start_datetime.value,
      location: this.state.location.value
    };

    axios({
      method: "POST",
      url: 'http://localhost:3001/api/v1/events',
      headers: JSON.parse(localStorage.user),
      data: { event: newEvent }
    })
      .then((response) => {
        this.addNewEvent(response.data);
        this.resetFormErrors();
      })
      .catch((error) => {
        this.setState({ formErrors: error.response.data, formValid: false });
      });
  };

  validateField(fieldName, fieldValue, fieldValidations) {
    let fieldValid = true
    let errors = fieldValidations.reduce((errors, validation) => {
      let [valid, fieldError] = validation(fieldValue)
      if(!valid) {
        errors = errors.concat([fieldError])
      }
      return(errors);
    }, []);

    fieldValid = errors.length === 0

    const newState = {formErrors: {...this.state.formErrors, [fieldName]: errors}}
    newState[fieldName] = {...this.state[fieldName], valid: fieldValid}
    this.setState(newState, this.validateForm)
  }

  validateForm() {
    this.setState({formValid: this.state.title.valid && this.state.location.valid && this.state.start_datetime.valid})
  }

  resetFormErrors () {
    this.setState({formErrors: {}})
  }

  render() {
    return (
      <div>
        <h4>Create an Event:</h4>
        <FormErrors formErrors = {this.state.formErrors} />
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="title" placeholder="Title" value={this.state.title.value} onChange={this.handleInput} />
          <input type="text" name="start_datetime" placeholder="Date" value={this.state.start_datetime.value} onChange={this.handleInput} />
          <input type="text" name="location" placeholder="Location" value={this.state.location.value} onChange={this.handleInput} />
          <input type="submit" value="Create Event"
           disabled={!this.state.formValid} />
        </form>
      </div>
    )
  }
}

export default EventForm
