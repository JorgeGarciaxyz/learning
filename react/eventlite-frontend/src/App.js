import logo from './logo.svg';
import './App.css';
import AppHeader from "./components/AppHeader";
import Eventlite from './components/Eventlite';
import AuthForm from './components/AuthForm';

const currentUser = function() {
  const user = localStorage.getItem('user');
  return(user);
}

function App() {
  return (
    <div className="App">
      <AppHeader />

      {currentUser() ?
        <Eventlite/> :
        // These <> are called fragments, help us instead of using empty divs
        <><AuthForm title="Log in" url="auth/sign_in"/>  <AuthForm title="Sign up" url="auth" /></>}
    </div>
  );
}

export default App;
