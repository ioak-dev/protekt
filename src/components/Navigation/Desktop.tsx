import React, { Component } from 'react';

import './style.scss';
import protekt_white from '../../images/protekt_white.svg';
import protekt_black from '../../images/protekt_black.svg';
import Links from './Links';
import { Authorization, Profile } from '../Types/GeneralTypes';

interface Props {    
    sendEvent: Function,
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    authorization: Authorization
    getProfile: Function,
    profile: Profile,
    login: Function,
    transparent: boolean,
    logout: Function,
    toggleSettings: any
}

interface State {
    showSettings: boolean
}

class Desktop extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.props.getProfile();
        this.state = {
            showSettings: false
        }
    }

    signin = (type) => {
        this.props.login(type);
    }

    render() {
        return (
            <div className={(this.props.transparent ? "navbar desktop transparent" : "navbar desktop")}>
                <div className="left">
                    {!this.props.transparent && this.props.profile.theme === 'theme_light' && <img className="logo" src={protekt_black} alt="Protekt logo" />}
                    {(this.props.transparent || this.props.profile.theme === 'theme_dark') && <img className="logo" src={protekt_white} alt="Protekt logo" />}
                    <Links authorization={this.props.authorization} profile={this.props.profile} />
                </div>
                <div className="right">
                    <div className="action">
                        {/* <button className="default disabled small" onClick={this.props.toggleSettings}><i className="material-icons">palette</i>Theme</button> */}
                        {this.props.authorization.isAuth && 
                            <button className="default disabled small" onClick={this.props.toggleSettings}><i className="material-icons">brush</i>Appearance</button>}
                        {this.props.authorization.isAuth && 
                            <button className="default disabled small" onClick={this.props.logout()}><i className="material-icons">power_settings_new</i>Logout</button>}
                        {!this.props.authorization.isAuth && 
                            <button className="default disabled small" onClick={() => this.signin('signin')}><i className="material-icons">person</i>Login</button>}
                        {!this.props.authorization.isAuth && 
                            <button className="default disabled small" onClick={() => this.signin('signup')}><i className="material-icons">person_add</i>Signup</button>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Desktop;