import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';

interface Props {
  authorization: Authorization,
  getAuth: Function,
  path: string,
  render: any
}

interface State {

}

class PrivateRoute extends Component<Props, State> {
  componentWillMount() {
    this.props.getAuth();
  }

  render() {
    return (
      <>
        {this.props.authorization.isAuth && <Route path={this.props.path} component={this.props.render} />}
        {!this.props.authorization.isAuth && <Redirect to={{pathname: "/home"}} />}
      </>
    );
  }
}

const mapStateToProps = state => ({
  authorization: state.authorization
})

export default connect(mapStateToProps, { getAuth })(PrivateRoute);