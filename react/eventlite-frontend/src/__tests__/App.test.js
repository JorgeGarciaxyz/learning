import { render, screen } from '@testing-library/react';
import App from '../App';

// we can also use it() instead of test().
// test accepts two arguments, the name of the test and a function which defines the test.
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Eventlite/i);
  expect(linkElement).toBeInTheDocument();
});
