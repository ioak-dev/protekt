import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router'
import { getProfile, setProfile, reloadProfile } from '../../actions/ProfileActions';
import {withCookies} from 'react-cookie';

import './style.scss';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { Switch } from '@material-ui/core';
import OakDialog from '../Ux/OakDialog';
import { Authorization, Profile } from '../Types/GeneralTypes';
import { receiveMessage } from '../../events/MessageService';
import OakButton from '../Ux/OakButton';

interface Props {    
    sendEvent: Function,
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    authorization: Authorization,
    getProfile: Function,
    setProfile: Function,
    reloadProfile: Function,
    profile: Profile,
    login: Function,
    transparent: boolean,
    logout: Function,
    toggleSettings: any,
    history: any,
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
        receiveMessage().subscribe(
            message => {
                if (message.name === 'navbar-transparency') {
                    this.setState({
                        transparentNavBar: message.signal
                    })
                }

                if (message.name === 'loggedin') {
                    this.props.reloadProfile(this.props.authorization);
                    this.setState({
                        firstLoad: false
                    })
                }

                if (message.name === 'loggedout') {
                    this.props.history.push('/home');
                }
            }
        )
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.firstLoad && nextProps.authorization && nextProps.authorization.isAuth) {
            this.props.reloadProfile(nextProps.authorization);
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

                <OakDialog visible={this.state.showSettings} toggleVisibility={this.toggleSettings}>
                    <div className="dialog-body">
                        <div className="settings">
                            <div>Dark mode</div>
                            <div>
                                <Switch
                                checked={this.props.profile.theme === 'theme_dark'}
                                onChange={this.toggleDarkMode}
                                inputProps={{ 'aria-label': 'primary checkbox' }}/>
                            </div>
                            
                            <div>Text Size</div>
                            <div>
                                <div className={"text-size size-1 space-right-1 " + (this.props.profile.textSize === 'textsize_tiny' ? 'active' : '')} onClick={() => this.changeTextSize('textsize_tiny')}>Az</div>
                                <div className={"text-size size-2 space-right-1 " + (this.props.profile.textSize === 'textsize_small' ? 'active' : '')} onClick={() => this.changeTextSize('textsize_small')}>Az</div>
                                <div className={"text-size size-3 space-right-1 " + (this.props.profile.textSize === 'textsize_medium' ? 'active' : '')} onClick={() => this.changeTextSize('textsize_medium')}>Az</div>
                                <div className={"text-size size-4 " + (this.props.profile.textSize === 'textsize_large' ? 'active' : '')} onClick={() => this.changeTextSize('textsize_large')}>Az</div>
                            </div>

                            <div className="typography-5">Color Scheme</div>
                            <div>
                                <div className="theme-color color-1" onClick={() => this.changeThemeColor('themecolor_1')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_1' && 'check'}</i></div>
                                <div className="theme-color color-2" onClick={() => this.changeThemeColor('themecolor_2')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_2' && 'check'}</i></div>
                                <div className="theme-color color-3" onClick={() => this.changeThemeColor('themecolor_3')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_3' && 'check'}</i></div>
                                <div className="theme-color color-4" onClick={() => this.changeThemeColor('themecolor_4')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_4' && 'check'}</i></div>
                            </div>
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <OakButton theme="primary" variant="animate none" action={this.toggleSettings}>Close</OakButton>
                    </div>
                </OakDialog>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfile, setProfile, reloadProfile })(withRouter(Navigation));