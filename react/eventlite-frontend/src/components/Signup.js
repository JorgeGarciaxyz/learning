import React from "react";

class Signup extends React.Component {
  render() {
    return (
      <div>
        <h2>Sign up</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <span>Email</span>
            <input name="email" ref={(input) => this.email = input } />
          </div>
          <div>
            <span>Password</span>
            <input type="password" name="password" ref={(input) => this.password = input } />
          </div>
        </form>
      </div>
    );
  }
}
