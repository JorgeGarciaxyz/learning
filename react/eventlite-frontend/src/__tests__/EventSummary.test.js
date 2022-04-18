import { render, screen } from '@testing-library/react';
import EventSummary from '../components/EventSummary';
import { BrowserRouter as Router } from 'react-router-dom'

it('renders event title', () => {
  const event = {
    title: "My title",
    start_datetime: "10-10-2022",
    location: "my house"
  }

  render(
  <Router>
    <EventSummary event={event} />
  </Router>
  )

  const titleElement = screen.getByText(event.title);
  expect(titleElement).toBeInTheDocument();
})
