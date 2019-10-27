import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import './Login.scss';
import ArcTextField from '../Ux/ArcTextField';
import { resetPassword } from './AuthService';
import { sendMessage } from '../../events/MessageService';
import {isEmptyOrSpaces} from "../Utils";

const queryString = require('query-string');

interface Props {
    history: any,
    location: any
}

interface State {
    password: string;
    repeatPassword: string;
    resetCode: string;
}

class ResetPassword extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            repeatPassword: '',
            resetCode:''
        }
    }

    componentDidMount() {
        if (this.props.location.search) {
            const query = queryString.parse(this.props.location.search);
            if (query.code) {
                this.setState({
                    resetCode: query.code
                })
            }else {
                this.props.history.push("/home");
            }
        }
    }

    handleChange = (event) => {
        this.setState(
            {
                ...this.state,
                [event.currentTarget.name]: event.currentTarget.value
            }
        )
    }

    changePassword = () => {
        if (isEmptyOrSpaces(this.state.password)) {
            sendMessage('notification', true, {message: 'password not provided', type: 'failure', duration: 5000});
            return;
        }

        if (isEmptyOrSpaces(this.state.repeatPassword) || isEmptyOrSpaces(this.state.repeatPassword)) {
            sendMessage('notification', true, {message: 'Repeat password not provided', type: 'failure', duration: 5000});
            return;
        }

        if (this.state.password !== this.state.repeatPassword) {
            sendMessage('notification', true, {message: 'Password is not matching', type: 'failure', duration: 5000});
            return;
        }

        this.resetPassword('password');

    }

    resetPassword = (type) => {
        resetPassword({
            password: this.state.password,
            resetCode: this.state.resetCode
        }, type)
            .then((response: any) => {
                if (response === 200) {
                    if (type === 'password') {
                        sendMessage('notification', true, {message: 'Password Changed successfully', type: 'success', duration: 3000});
                    }
                } else {
                    sendMessage('notification', true, {'type': 'failure', message: 'Invalid request', duration: 3000});
                }
            })
            .catch((error) => {
                sendMessage('notification', true, {'type': 'failure', message: 'Bad request', duration: 3000});
            })
    }

    render() {
        return (
            <div className="login">
                <div className="container">
                    <form method="GET" onSubmit={this.changePassword} noValidate>
                        <h1>Reset password</h1>
                        <div className="form">
                        <ArcTextField label="Password" id="password" type="password" data={this.state} handleChange={e => this.handleChange(e)} />
                            <ArcTextField label="Repeat Password" id="repeatPassword" type="password" data={this.state} handleChange={e => this.handleChange(e)} />
                        </div>
                        <br />
                        <button className="primary block"  onClick={this.changePassword}>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    authorization: state.authorization
})

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(ResetPassword);
