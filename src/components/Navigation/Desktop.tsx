import React, { useEffect } from 'react';

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

const Desktop = (props: Props) => {
  useEffect(() => {
    props.getProfile();
  }, []);

  return (
    <div
      className={
        props.transparent ? 'navbar desktop transparent' : 'navbar desktop'
      }
    >
      <div className="left">
        {!props.transparent && props.profile.theme === 'theme_light' && (
          <img className="logo" src={protektBlack} alt="Protekt logo" />
        )}
        {(props.transparent || props.profile.theme === 'theme_dark') && (
          <img className="logo" src={protektWhite} alt="Protekt logo" />
        )}
        <Links authorization={props.authorization} profile={props.profile} />
      </div>
      <div className="right">
        <div className="action">
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
              theme="default"
              variant="outline"
              small
              action={() => props.login('signin')}
            >
              <i className="material-icons">person</i>Login
            </OakButton>
          )}
          {!props.authorization.isAuth && (
            <OakButton
              theme="default"
              variant="outline"
              small
              action={() => props.login('signup')}
            >
              <i className="material-icons">person_add</i>Signup
            </OakButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Desktop;
