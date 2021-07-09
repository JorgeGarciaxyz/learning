import React from 'react'

class EventForm extends React.Component {
  constructor(props) {
    super(props)

    this.sate = {
      title: '',
      start_datetime: '',
      location: ''
    }
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    const name = e.target.name;
    const newState = {};

    newState[name] = e.target.value;

    this.setState(newState)
    e.preventDefault();
  }

  render () {
    return (
      <div>
        <h4>Create an Event: </h4>
        <form>
          <input type="text" name="title" placeholder="Title" value={this.state.title} onChange={this.handleInput} />
          <input type="text" name="start_datetime" placeholder="Date" value={this.state.start_datetime} onChange={this.handleInput}/>
          <input type="text" name="location" placeholder="Location" value={this.state.Location} onChange={this.handleInput}/>
          <button type="submit">Create Event</button>
        </form>
      </div>
    )
  }
}

export default EventForm
