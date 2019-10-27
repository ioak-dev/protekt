import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router'
import { getProfile, setProfile } from '../../actions/ProfileActions';
import {withCookies} from 'react-cookie';

import './style.scss';
import Desktop from './Desktop';
import Mobile from './Mobile';

import { Authorization, Profile } from '../Types/GeneralTypes';
import { sendMessage, receiveMessage } from '../../events/MessageService';

interface Props {    
    sendEvent: Function,
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    authorization: Authorization,
    getProfile: Function,
    setProfile: Function,
    profile: Profile,
    login: Function,
    transparent: boolean,
    logout: Function,
    toggleSettings: any,
    history: any,
    cookies: any,
    location: any,
    match: any
}

interface State {
    visible: boolean,
    mobilemenu: string,
    chooseTheme: boolean,
    showSettings: boolean,
    transparentNavBar: boolean,
    firstLoad: boolean
}

class Navigation extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.props.getProfile();
        this.state = {
            visible: false,
            mobilemenu: 'hide',
            chooseTheme: false,
            showSettings: false,
            transparentNavBar: false,
            firstLoad: true
        }
    }

    componentDidMount() {
        receiveMessage().subscribe(message => {
            if (message.name === 'navbar-transparency') {
                this.setState({
                    transparentNavBar: message.signal
                })
            }
            if (message.name === 'loggedin') {
                // this.props.reloadProfile(nextProps.authorization);
                this.setState({
                    firstLoad: false
                })
            }
        })
    }

    

    componentWillReceiveProps(nextProps) {
        if (this.state.firstLoad && nextProps.authorization && nextProps.authorization.isAuth) {
            // this.props.reloadProfile(nextProps.authorization);
            this.setState({
                firstLoad: false
            })
        }
    }

    toggleDarkMode = () => {
        if (this.props.profile.theme === 'theme_dark') {
            this.props.setProfile({
                ...this.props.profile,
                theme: 'theme_light'
            })   
        } else  {
            this.props.setProfile({
                ...this.props.profile,
                theme: 'theme_dark'
            })   
        }
    }

    changeTextSize = (size) => {
        this.props.setProfile({
            ...this.props.profile,
            textSize: size
        })
    }

    changeThemeColor = (color) => {
        this.props.setProfile({
            ...this.props.profile,
            themeColor: color
        })
    }

    login = (type) => {
        this.props.history.push('/login?type=' + type);
    }

    toggleSettings = () => {
        this.setState({
            showSettings: !this.state.showSettings
        })
    }

    render() {
        return (
            <div className="nav">
                <Desktop {...this.props} logout={this.props.logout} login={this.login} toggleSettings={this.toggleSettings} transparent={this.state.transparentNavBar} />
                <Mobile {...this.props} logout={this.props.logout} login={this.login} toggleSettings={this.toggleSettings} transparent={this.state.transparentNavBar} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfile, setProfile })(withCookies(withRouter(Navigation)));