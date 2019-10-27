import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';

interface Props {
  authorization: Authorization,
  getAuth: Function,
  path: string,
  render: any,
  renderAlt: any,
  location: any
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
        {this.props.authorization.isAuth && <Route path={this.props.path} render={this.props.render} />}
        {/* {!this.props.authorization.isAuth && <Route path="/login" render={this.props.renderAlt} />} */}
        {/* {!this.props.authorization.isAuth && <Redirect to={{pathname: "/login", state: { from: this.props.location}}} />} */}
        {/* {!this.props.authorization.isAuth && <Redirect to={{pathname: "/login"}} />} */}
      </>
    );
  }
}

const mapStateToProps = state => ({
  authorization: state.authorization
})

export default connect(mapStateToProps, { getAuth })(PrivateRoute);