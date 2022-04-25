import { render, screen } from '@testing-library/react';
import EventSummary from '../components/EventSummary';
import { BrowserRouter as Router } from 'react-router-dom'
import TestRenderer from 'react-test-renderer';

const event = {
  title: "My title",
  start_datetime: "10-10-2022",
  location: "my house"
}

it('renders event title', () => {
  render(
  <Router>
    <EventSummary event={event} />
  </Router>
  )

  const titleElement = screen.getByText(event.title);
  expect(titleElement).toBeInTheDocument();
  // If there's an image
  // const image = getByRole('img', {src: 'event.png'})
})

it('should render an event summary card', () => {
  //render(<EventSummary />)
  render(
    <Router>
      <EventSummary event={event} />
    </Router>
    )
  expect(document.body.innerHTML).toMatchSnapshot()
})

// Not working IDK why
it('should render an event summary card renderer', () => {
  //render(<EventSummary />)
  const tree = TestRenderer.create(<EventSummary event={event} />).toJSON();

  expect(tree).toMatchSnapshot();
})
