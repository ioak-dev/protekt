import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withCookies } from 'react-cookie';
import { Switch } from '@material-ui/core';
import {
  getProfile,
  setProfile,
  reloadProfile
} from '../../actions/ProfileActions';

import './style.scss';
import Desktop from './Desktop';
import Mobile from './Mobile';
import OakDialog from '../../oakui/OakDialog';
import { Authorization, Profile } from '../Types/GeneralTypes';
import { receiveMessage } from '../../events/MessageService';
import OakButton from '../../oakui/OakButton';

interface Props {
  sendEvent: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  authorization: Authorization;
  getProfile: Function;
  setProfile: Function;
  reloadProfile: Function;
  profile: Profile;
  login: Function;
  transparent: boolean;
  logout: Function;
  toggleSettings: any;
  history: any;
  cookies: any;
  location: any;
  match: any;
}

const Navigation = (props: Props) => {
  const [data, setData] = useState({
    visible: false,
    mobilemenu: 'hide',
    chooseTheme: false,
    showSettings: false,
    transparentNavBar: false,
    firstLoad: true
  });

  useEffect(() => {
    props.getProfile();
  }, []);

  useEffect(() => {
    const eventBus = receiveMessage().subscribe(message => {
      if (message.name === 'navbar-transparency') {
        setData({ ...data, transparentNavBar: message.signal });
      }

      if (message.name === 'loggedin') {
        props.reloadProfile(props.authorization);
        setData({ ...data, firstLoad: false });
      }

      if (message.name === 'loggedout') {
        props.history.push('/home');
      }
    });
    return () => eventBus.unsubscribe();
  });

  useEffect(() => {
    if (data.firstLoad && props.authorization?.isAuth) {
      props.reloadProfile(props.authorization);
      setData({ ...data, firstLoad: false });
    }
  }, [props.authorization]);

  const toggleDarkMode = () => {
    if (props.profile.theme === 'theme_dark') {
      props.setProfile({ ...props.profile, theme: 'theme_light' });
    } else {
      props.setProfile({ ...props.profile, theme: 'theme_dark' });
    }
  };

  const changeTextSize = size => {
    props.setProfile({ ...props.profile, textSize: size });
  };

  const changeThemeColor = color => {
    props.setProfile({ ...props.profile, themeColor: color });
  };

  const login = type => {
    props.history.push(`/login?type=${type}`);
  };

  const toggleSettings = () => {
    setData({ ...data, showSettings: !data.showSettings });
  };

  return (
    <div className="nav">
      <Desktop
        {...props}
        logout={() => props.logout()}
        login={login}
        toggleSettings={() => toggleSettings()}
        transparent={data.transparentNavBar}
      />
      <Mobile
        {...props}
        logout={() => props.logout()}
        login={login}
        toggleSettings={() => toggleSettings()}
        transparent={data.transparentNavBar}
      />

      <OakDialog
        visible={data.showSettings}
        toggleVisibility={() => toggleSettings()}
      >
        <div className="dialog-body">
          <div className="settings">
            <div>Dark mode</div>
            <div>
              <Switch
                checked={props.profile.theme === 'theme_dark'}
                onChange={() => toggleDarkMode()}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>

            <div>Text Size</div>
            <div>
              <div
                className={`text-size size-1 space-right-1 ${
                  props.profile.textSize === 'textsize_tiny' ? 'active' : ''
                }`}
                onClick={() => changeTextSize('textsize_tiny')}
              >
                Az
              </div>
              <div
                className={`text-size size-2 space-right-1 ${
                  props.profile.textSize === 'textsize_small' ? 'active' : ''
                }`}
                onClick={() => changeTextSize('textsize_small')}
              >
                Az
              </div>
              <div
                className={`text-size size-3 space-right-1 ${
                  props.profile.textSize === 'textsize_medium' ? 'active' : ''
                }`}
                onClick={() => changeTextSize('textsize_medium')}
              >
                Az
              </div>
              <div
                className={`text-size size-4 ${
                  props.profile.textSize === 'textsize_large' ? 'active' : ''
                }`}
                onClick={() => changeTextSize('textsize_large')}
              >
                Az
              </div>
            </div>

            <div className="typography-5">Color Scheme</div>
            <div>
              <div
                className="theme-color color-1"
                onClick={() => changeThemeColor('themecolor1')}
              >
                <i className="material-icons">
                  {props.profile.themeColor === 'themecolor1' && 'check'}
                </i>
              </div>
              <div
                className="theme-color color-2"
                onClick={() => changeThemeColor('themecolor2')}
              >
                <i className="material-icons">
                  {props.profile.themeColor === 'themecolor2' && 'check'}
                </i>
              </div>
              <div
                className="theme-color color-3"
                onClick={() => changeThemeColor('themecolor3')}
              >
                <i className="material-icons">
                  {props.profile.themeColor === 'themecolor3' && 'check'}
                </i>
              </div>
              <div
                className="theme-color color-4"
                onClick={() => changeThemeColor('themecolor4')}
              >
                <i className="material-icons">
                  {props.profile.themeColor === 'themecolor4' && 'check'}
                </i>
              </div>
              <div
                className="theme-color color-5"
                onClick={() => changeThemeColor('themecolor5')}
              >
                <i className="material-icons">
                  {props.profile.themeColor === 'themecolor5' && 'check'}
                </i>
              </div>
              <div
                className="theme-color color-6"
                onClick={() => changeThemeColor('themecolor6')}
              >
                <i className="material-icons">
                  {props.profile.themeColor === 'themecolor6' && 'check'}
                </i>
              </div>
            </div>
          </div>
        </div>
        <div className="dialog-footer">
          <OakButton
            theme="primary"
            variant="animate none"
            action={() => toggleSettings()}
          >
            Close
          </OakButton>
        </div>
      </OakDialog>
    </div>
  );
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, {
  getProfile,
  setProfile,
  reloadProfile
})(withCookies(withRouter(Navigation)));
