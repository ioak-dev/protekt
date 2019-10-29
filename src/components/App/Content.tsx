import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './style.scss';
import Home from '../Home';
import Bookmarks from '../Bookmarks';
import Notes from '../Notes';
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Login from '../Auth/Login';
import PrivateRoute from '../Auth/PrivateRoute';
import AuthInit from '../Auth/AuthInit';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import { getProfile } from '../../actions/ProfileActions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Backdrop from './Backdrop';
import Notification from '../Notification';
import Navigation from '../Navigation';
import Settings from '../Settings';
import { Authorization } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import ResetPassword from '../Auth/ResetPassword';

const themes = {
    'themecolor_1': getTheme('#C4005B'),
    'themecolor_2': getTheme('#803BC2'),
    'themecolor_3': getTheme('#E74443'),
    'themecolor_4': getTheme('#29BE3B'),
    'themecolor_5': getTheme('#ffe20f'),
    'themecolor_6': getTheme('#4d4dff')
}

function getTheme(color) {
    return createMuiTheme({
        palette: {
          primary: {
              main: color         
          },
          secondary: {
              main: color
          }
        }
      });
}

interface Props {
    getProfile: Function,
    setProfile: Function,
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    history: any,

    // event: PropTypes.object,
    profile: any,
    authorization: Authorization
}

interface State {
    authorization: Authorization,
    profile: any,
    event: any
}

class Content extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.props.getProfile();
        this.props.getAuth();
    }
    
    logout = (event, type = 'success', message = 'You have been logged out') => {
        this.props.removeAuth();
        sendMessage('notification', true, {type: type, message: message, duration: 3000});
        sendMessage('loggedout', true);
    }

    render() {
        return (
            <div className={"App " + this.props.profile.theme + " " + this.props.profile.textSize + " " + this.props.profile.themeColor}>
                
                <HashRouter>
                    <AuthInit {...this.props} />
                    <Backdrop />
                    <div className="body">
                        <div className="body-content">
                            <Notification />
                            <MuiThemeProvider theme={themes[this.props.profile.themeColor]}>
                                <Navigation {...this.props} logout={() => this.logout}/>
                                <Route exact path="/" render={(props) => <Home {...props} {...this.props} logout={() => this.logout}/>} />
                                <Route path="/home" render={(props) => <Home {...props} {...this.props} logout={() => this.logout}/>} />
                                <Route path="/login" render={(props) => <Login {...props} {...this.props} logout={() => this.logout}/>} />
                                <Route path="/reset" render={(props) => <ResetPassword {...props} {...this.props} logout={() => this.logout}/>} />
                                <PrivateRoute path="/bookmarks" render={(props) => <Bookmarks {...props} {...this.props} logout={this.logout} />} />
                                <PrivateRoute path="/notes" render={(props) => <Notes {...props} {...this.props} logout={() => this.logout} />} />
                                <PrivateRoute path="/settings" render={(props) => <Settings {...props} {...this.props} logout={() => this.logout}/>} />
                            </MuiThemeProvider>
                        </div>
                    </div>
                </HashRouter>
            </div>
        );
    }
}

const mapStateToProps = state => ({
  authorization: state.authorization,
  profile: state.profile
})

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth, getProfile })(Content);
