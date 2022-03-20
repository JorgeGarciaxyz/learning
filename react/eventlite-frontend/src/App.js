import './App.css';
import AppHeader from "./components/AppHeader";
import Eventlite from './components/Eventlite';
import AuthForm from './components/AuthForm';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <AppHeader />

      <Routes>
        <Route path="/" element={<Eventlite/>}/>

        <Route path="/login" element={<AuthForm title="Log in" url="auth/sign_in"/>}/>

        <Route path="/signup" element={<AuthForm title="Sign up" url="auth"/>}/>
      </Routes>
    </Router>
   );
}

export default App;
