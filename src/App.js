import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      online: navigator.onLine
    };

    const listener = () => this.setState({ online: navigator.onLine });
    window.addEventListener('online', listener);
    window.addEventListener('offline', listener);
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to SW-Finance</h2>
        </div>
        <p className="App-intro">
          You're curently <strong>{this.state.online ? 'online' : 'offline' }</strong>
        </p>
      </div>
    );
  }
}

export default App;
