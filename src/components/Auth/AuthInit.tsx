import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';

interface Props {
    authorization: Authorization,
    addAuth: Function,
    getAuth: Function,
    removeAuth: Function
}

interface State {

}

class AuthInit extends Component<Props, State> {
    componentWillMount() {
        if (!this.props.authorization.isAuth) {
            console.log(this.props);
        }
        this.props.getAuth();
    }

    render() {
        return (
            <></>
        )
    }
}

const mapStateToProps = state => ({
    authorization: state.authorization
})

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(AuthInit);