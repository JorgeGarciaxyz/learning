import './App.css';
import AppHeader from "./components/AppHeader";
import Eventlite from './components/Eventlite';
import AuthForm from './components/AuthForm';
import Event from './components/Event';
import Eevent from './components/Eevent';
import EventForm from './components/EventForm';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function App() {
  const currentUser = localStorage.getItem('user');

  return (
    <Router>
      <AppHeader />

      <Routes>
        <Route path="/" element={<Eventlite />} />

        <Route path="/login" element={
          currentUser ?
            <Navigate replace to="/" /> :
            <AuthForm title="Log in" url="auth/sign_in" />
        } />

        <Route path="/signup" element={
          currentUser ?
            <Navigate replace to="/" /> :
            <AuthForm title="Sign up" url="auth" />
        }/>

        <Route path="/events/:id" element={<Event/>} />
        <Route path="/eevents/:id" element={<Eevent/>} />
        <Route path="/events/:id/edit" element={
          currentUser ?
            <EventForm/> :
            <AuthForm title="Log in" url="auth/sign_in" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
