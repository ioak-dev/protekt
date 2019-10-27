import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import {withCookies} from 'react-cookie';
import './Login.scss';
import { Authorization } from '../Types/GeneralTypes';

interface Props {
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    cookies: any,
    history: any,
    authorization: Authorization
}

interface State {
    newuser: boolean
}

class Login extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            newuser: false
        }
    }

    login = () => {
        // Real check
        this.success();
    }

    logout = () => {
        this.props.removeAuth();
        this.props.cookies.remove('isAuth');
    }

    success = () => {
        this.props.addAuth({
            isAuth: true,
            firstname: 'Arun Kumar',
            lastname: 'Selvaraj'
        });
        this.props.cookies.set('isAuth', true);
        this.props.history.push("/");
    }

    toggle = () => {
        this.setState({
            newuser: !this.state.newuser
        });
    }

    render() {
        return (
            <>
                <div className="login boxed">
                    {this.props.authorization.isAuth && <button className="secondary animate alt" onClick={this.logout}>Logout</button>}
                    {!this.props.authorization.isAuth && <button className="primary block" onClick={this.login}>Login</button>}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    authorization: state.authorization
})

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(withCookies(Login));