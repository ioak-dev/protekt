import React, { Component } from 'react';

import './style.scss';
import mirror_white from '../../images/mirror_white.svg';
import mirror_black from '../../images/mirror_black.svg';
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
    menu: boolean,
    showSearchBar: boolean
}

class Mobile extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.props.getProfile();
        this.state = {
            showSearchBar: false,
            menu: false
        }
    }

    toggleMenu = () => {
        this.setState({
            menu: !this.state.menu
        })
    }

    signin = (type) => {
        this.props.login(type);
    }

    render() {
        return (
            <>
            <div className={(this.props.transparent ? "navbar mobile transparent" : "navbar mobile")}>
                <div className="left">
                    {!this.props.transparent && this.props.profile.theme === 'theme_light' && <img className="logo" src={mirror_white} alt="Curate logo" />}
                    {(this.props.transparent || this.props.profile.theme === 'theme_dark') && <img className="logo" src={mirror_white} alt="Curate logo" />}
                    {/* links */}
                </div>
                <div className="right">
                    {/* <div className="settings-icon" onClick={this.props.toggleSettings}><i className="material-icons">settings</i></div> */}
                    <div className={(this.state.menu ? "menu active" : "menu")} onClick={this.toggleMenu}><div></div></div>
                    {/* action login */}
                </div>
            </div>
            <div className={(this.state.menu ? "slider show" : "slider hide")} onClick={this.toggleMenu}>
                <div className={(this.state.menu ? "container": "container hidetext")} onClick={this.toggleMenu}>
                    <div className="action">
                        <div className="settings-icon" onClick={this.props.toggleSettings}>
                            {this.props.authorization.isAuth && <button className="invert animate alt small" onClick={this.props.toggleSettings}><i className="material-icons">brush</i>Action 1</button>}
                        </div>
                        <div className="buttons">
                            {this.props.authorization.isAuth && <button className="invert animate alt small" onClick={this.props.logout()}><i className="material-icons">power_settings_new</i>Logout</button>}
                            {!this.props.authorization.isAuth && <button className="invert animate alt small left" onClick={() => this.signin('signin')}><i className="material-icons">person</i>Login</button>}
                            {!this.props.authorization.isAuth && <button className="invert animate alt small right" onClick={() => this.signin('signup')}><i className="material-icons">person_add</i>Signup</button>}
                        </div>
                    </div>
                    <Links authorization={this.props.authorization} profile={this.props.profile}/>
                </div>
            </div>
            </>
        );
    }
}

export default Mobile;