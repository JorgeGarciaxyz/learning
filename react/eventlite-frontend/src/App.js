import logo from './logo.svg';
import './App.css';
import AppHeader from "./components/AppHeader";
import Eventlite from './components/Eventlite';
import Login from './components/Login';

const currentUser = function() {
  const user = localStorage.getItem('user');
  return(user);
}

function App() {
  return (
    <div className="App">
      <AppHeader />
      {currentUser() ? <Eventlite/> : <Login/> }
    </div>
  );
}

export default App;
