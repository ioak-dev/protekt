import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../../store';
import './style.scss';
import './button-oval.scss';
import './metric.scss';
import Content from './Content';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Content {...this.props} />
      </Provider>
    );
  }
}

export default App;
