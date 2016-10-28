const API_URL = 'http://localhost:9000/api';

class Broadcaster {
  constructor() {
    this.subs = [];
  }
  register(sub) {
    this.subs.push(sub);
  }
  broadcast(event) {
    this.subs.forEach(s => {
      s(event);
    });
  }
}

const broadcaster = new Broadcaster();

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
    };

    // clone
    this.state = Object.assign({}, this.defaultState);
  }
  submit(ev) {
    ev.preventDefault();
    this.state.amount = +this.state.amount;
    console.log('Sending', this.state);
    superagent
      .post(`${API_URL}/${this.state.type}`)
      .send(this.state)
      .end((err, res) => {
        if (err || !res.ok) {
          // TODO - Handle error
        } else {
          window.reg.showNotification('New ' + this.state.type + ' added!', {
            body: 'We\'ve added ' + this.state.description + ' to your ' + this.state.type + 's.',
            icon: '/assets/img/expense-icon.png',
            tag: "notification-1"
          });
          this.setState(this.defaultState);
          broadcaster.broadcast('shouldUpdate');
        }
      });
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

    Notification.requestPermission(result => {
      if (result !== 'granted') {
        alert('Bro seriously this is a demo why would you not accept notifcations...')
      }
    });

    this.state = {
      online: navigator.onLine,
      data: []
    };

    const listener = () => this.setState({online: navigator.onLine});
    window.addEventListener('online', listener);
    window.addEventListener('offline', listener);

    broadcaster.register(event => {
      if (event === "shouldUpdate") {
        this.update();
      }
    });

    this.update();
  }

  update() {
    superagent
      .get('http://localhost:9000/api/overview')
      .end((err, res) => {
        this.setState({
          data: res.body || []
        });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Balance amount={this.state.data.length ? this.state.data[this.state.data.length - 1].balance : 0} />
        </div>

        <Overview data={this.state.data} />

        <Form />

        <p className="App-intro">
          You're curently <strong>{this.state.online ? 'online' : 'offline' }</strong>
        </p>


      </div>
    );
  }
}
