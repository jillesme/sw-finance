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
};

class Overview extends React.Component {
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

class Form extends React.Component {
  constructor () {
    super();
    this.defaultState = {
      description: '',
      amount: 0,
      type: 'expense'
    }

    // clone
    this.state = Object.assign({}, this.defaultState);
  }
  submit(ev) {
    ev.preventDefault();
    console.log('Sending', this.state);
    setTimeout(() => {
      window.reg.showNotification('New ' + this.state.type + ' added!', {
        body: 'We\'ve added ' + this.state.description + ' to your ' + this.state.type + 's.',
        icon: 'expense-icon.png',
        tag: "notification-1",
      });
      this.setState(this.defaultState);
    }, 1000)
  }
  setField(ev, name) {
    this.setState({ [name]: ev.target.value});
  }
  render() {
    return (
    <form>
      <p>{this.state.description} - {this.state.amount} - {this.state.type}</p>
      <label>Description: <input value={this.state.description} type="text" onChange={(ev) => this.setField(ev, 'description')}/></label>
      <label>Amount: <input value={this.state.amount} type="number" min="0" onChange={(ev) => this.setField(ev, 'amount')}/></label>
      <label>Type:
        <select defaultValue={this.state.type} onChange={(ev) => this.setField(ev, 'type')}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
      </select>
    </label>
    <button onClick={(ev) => this.submit(ev)}>Save</button>
    </form>
    )
  }
}

class App extends React.Component {
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

        <Form />

        <p className="App-intro">
          You're curently <strong>{this.state.online ? 'online' : 'offline' }</strong>
        </p>


      </div>
    );
  }
}
