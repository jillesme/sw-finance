import React, { Component } from 'react';
import './App.css';

const FAKE_BACKEND = [{
  "type": "expense",
  "description": "Phone bill",
  "amount": 35.00,
  "balance": 2200.00
},
{
  "type": "expense",
  "description": "Brazzers subscription",
  "amount": 99.00,
  "balance": 2101.00
},
{
  "type": "income",
  "description": "Salary",
  "amount": 2000.00,
  "balance": 4101.00
},
{
  "type": "income",
  "description": "Child support",
  "amount": 225.00,
  "balance": 4326.00
}];

const Balance = (props) => <h1>&euro; {props.amount}</h1>;

const List = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      <ul>
        {props.data.map((listItem, i) => <li key={i}>{listItem.description} - &euro;{listItem.amount}</li>)}
      </ul>
    </div>
  )
}

class Overview extends Component {
  render() {
    let groups = this.props.data.reduce((current, next) => {
      current[next.type].push(next);
      return current;
    }, { expense: [], income: [] });

    return (<div>
      <List title="Expense" data={groups.expense} />
      <List title="Income" data={groups.income} />
      </div>)
  }
}

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
          <Balance amount="1405,22" />
        </div>

        <Overview data={FAKE_BACKEND} />

        <p className="App-intro">
          You're curently <strong>{this.state.online ? 'online' : 'offline' }</strong>
        </p>


      </div>
    );
  }
}

export default App;
