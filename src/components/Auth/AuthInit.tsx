import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import PropTypes from 'prop-types';
import {withCookies, ReactCookieProps} from 'react-cookie';
import { Authorization } from '../Types/GeneralTypes';

interface Props extends ReactCookieProps {
    authorization: Authorization,
    addAuth: Function,
    getAuth: Function,
    removeAuth: Function,
    cookies: any
}

interface State {

}

class AuthInit extends Component<Props, State> {
    componentWillMount() {
        if (!this.props.authorization.isAuth && this.props.cookies.get('isAuth')) {
            this.props.addAuth({
                isAuth: true,
                firstname: 'Arun Kumar',
                lastname: 'Selvaraj'
            });
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

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(withCookies(AuthInit));