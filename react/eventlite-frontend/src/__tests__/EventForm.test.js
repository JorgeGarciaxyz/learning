import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'
import EventForm from "../components/EventForm";
import moment from 'moment'

test("submit button is disabled for empty form", () => {
  render(
    <Router>
       <EventForm />)
    </Router>
  )
  const submitButton = screen.getByRole("button", { type: "submit"} );

  expect(submitButton).toBeDisabled();
})

test("submit button is enabled if all form inputs are valid", () => {
  render(
    <Router>
       <EventForm />)
    </Router>
  )

  const submitButton = screen.getByRole("button", { type: "submit"} );
  expect(submitButton).toBeDisabled();

  fireEvent.input(
    screen.getByTestId("title"), { target: { value: 'My Shiny Conference' } }
  )
  expect(submitButton).toBeDisabled();

  fireEvent.input(
    screen.getByTestId("start_datetime"), { target: { value: moment().add(10, "days")} }
  )
  expect(submitButton).toBeDisabled();

  fireEvent.input(
    screen.getByTestId("location"), { target: { value: 'My House' } }
  )
  expect(submitButton).toBeEnabled();
})
