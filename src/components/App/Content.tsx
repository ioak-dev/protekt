import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './style.scss';
import Home from '../Home';
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Login from '../Auth/Login';
import Landing from '../Landing';
import PrivateRoute from '../Auth/PrivateRoute';
import AuthInit from '../Auth/AuthInit';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import { getProfile, setProfile } from '../../actions/ProfileActions';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Backdrop from './Backdrop';
import Notification from '../Notification';
import Navigation from '../Navigation';
import { Authorization } from '../Types/GeneralTypes';
import { receiveMessage, sendMessage } from '../../events/MessageService';

const themes = {
    'themecolor_1': getTheme('#69A7BF'),
    'themecolor_2': getTheme('#99587B'),
    'themecolor_3': getTheme('#A66C26'),
    'themecolor_4': getTheme('#37AE82')
}

function getTheme(color: string) {
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
    cookies: any,

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


        this.state = {
            authorization: {
                isAuth: false
            },
            event: {},
            profile: {}
        }
    }

    componentDidMount() {
        receiveMessage().subscribe();
    }
    
    logout = (event: any, type = 'success', message = 'You have been logged out') => {
        this.props.removeAuth();
        this.props.cookies.remove('isAuth');
        this.props.cookies.remove('token');
        this.props.cookies.remove('secret');
        this.props.cookies.remove('name');
        sendMessage('notification', true, {type: type, message: message, duration: 3000});
    }

    render() {
        return (
            <div className={"App"}>
                
                <HashRouter>
                    <AuthInit />
                    <Backdrop />
                    <div className="body">
                        <div className="body-content">
                            <Notification />
                            <MuiThemeProvider theme={themes['themecolor_1']}>
                                <Navigation {...this.props} logout={() => this.logout} event={this.state.event} />
                                <Route path="/home" render={(props: any) => <Home {...props} {...this.props} logout={() => this.logout} event={this.state.event} />} />
                                <Route path="/login" render={(props: any) => <Login {...props} {...this.props} logout={() => this.logout} event={this.state.event} />} />
                                <Route path="/" exact render={(props: any) => <Landing {...props} {...this.props} logout={() => this.logout} event={this.state.event} />} />
                            </MuiThemeProvider>
                        </div>
                    </div>
                </HashRouter>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
  authorization: state.authorization,
  profile: state.profile//,
//   event: state.event
})

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth, getProfile, setProfile })(withCookies(Content));
