import React from "react";
import axios from 'axios';

class Login extends React.Component {
  handleLogin = (e) => {
    e.preventDefault();
    axios({
      method: 'POST',
      url: 'http://localhost:3001/api/v1/auth/sign_in',
      data: {
        email: this.email.value,
        password: this.password.value
      }
    }).then(response => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          'access-token': response.headers['access-token'],
          'client': response.headers['client'],
          'uid': response.data.data.uid
        })
      )
      window.location = '/';
    })
  }

  render() {
    return(
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleLogin}>
          <div>
            <span>Email</span>
            <input name="email" ref={(input) => this.email = input} />
          </div>
          <div>
            <span>Password</span>
            <input name="password" type="password" ref={(input) => this.password = input} />
          </div>
          <input type="submit" value="Log in" />
        </form>
      </div>
    )
  }
}

export default Login
