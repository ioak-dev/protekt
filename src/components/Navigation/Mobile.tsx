import React, { Component, useState, useEffect } from 'react';

import './style.scss';
import protektWhite from '../../images/protekt_white.svg';
import protektBlack from '../../images/protekt_black.svg';
import Links from './Links';
import { Authorization, Profile } from '../Types/GeneralTypes';
import OakButton from '../../oakui/OakButton';

interface Props {
  sendEvent: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  authorization: Authorization;
  getProfile: Function;
  profile: Profile;
  login: Function;
  transparent: boolean;
  logout: Function;
  toggleSettings: any;
}

const Mobile = (props: Props) => {
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    props.getProfile();
  }, []);

  return (
    <>
      <div
        className={
          props.transparent ? 'navbar mobile transparent' : 'navbar mobile'
        }
      >
        <div className="left">
          {!props.transparent && props.profile.theme === 'theme_light' && (
            <img className="logo" src={protektBlack} alt="Curate logo" />
          )}
          {(props.transparent || props.profile.theme === 'theme_dark') && (
            <img className="logo" src={protektWhite} alt="Curate logo" />
          )}
          {/* links */}
        </div>
        <div className="right">
          {/* <div className="settings-icon" onClick={props.toggleSettings}><i className="material-icons">settings</i></div> */}
          <div
            className={menu ? 'menu active' : 'menu'}
            onClick={() => setMenu(!menu)}
          >
            <div />
          </div>
          {/* action login */}
        </div>
      </div>
      <div
        className={menu ? 'slider show' : 'slider hide'}
        onClick={() => setMenu(!menu)}
      >
        <div
          className={menu ? 'container' : 'container hidetext'}
          onClick={() => setMenu(!menu)}
        >
          <div className="action">
            <div className="settings-icon" onClick={props.toggleSettings}>
              {props.authorization.isAuth && (
                <OakButton
                  theme="default"
                  variant="outline"
                  small
                  action={props.toggleSettings}
                >
                  <i className="material-icons">brush</i>Appearance
                </OakButton>
              )}
            </div>
            <div className="buttons">
              {props.authorization.isAuth && (
                <OakButton
                  theme="default"
                  variant="outline"
                  small
                  action={props.logout()}
                >
                  <i className="material-icons">power_settings_new</i>Logout
                </OakButton>
              )}
              {!props.authorization.isAuth && (
                <OakButton
                  theme="secondary"
                  variant="animate none"
                  small
                  action={() => props.login('signin')}
                >
                  <i className="material-icons">person</i>Login
                </OakButton>
              )}
              {!props.authorization.isAuth && (
                <OakButton
                  theme="secondary"
                  variant="animate none"
                  small
                  action={() => props.login('signup')}
                >
                  <i className="material-icons">person_add</i>Signup
                </OakButton>
              )}
            </div>
          </div>
          <Links authorization={props.authorization} profile={props.profile} />
        </div>
      </div>
    </>
  );
};

export default Mobile;
