import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import './App.css';
import { OpenAirComponent } from './components/OpenAirComponent';
import { Home } from './components/Home';
import { NotFound } from './components/NotFound';
import history from './history';




class App extends Component {

  render() {
    return (
      <Router history={history}>
        <Container>

          <Menu secondary>
            <Menu.Item
              name='home'
              onClick={this.navigateToHome}
            />
          </Menu>


          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/open-air/:address' component={OpenAirComponent}/>
            <Route component={NotFound} />
          </Switch>

        </Container>
      </Router>
    );
  }


  navigateToHome(e){
    e.preventDefault();
    history.push('/');
  }
}

export default App;
