import React from 'react';
import './style.scss';
import { Switch } from '@material-ui/core';
import { Authorization, Profile } from '../Types/GeneralTypes';

interface Props {
  profile: Profile;
  persistProfile: Function;
  authorization: Authorization;
}

const Appearance = (props: Props) => {
  const toggleDarkMode = () => {
    if (props.profile.theme === 'theme_dark') {
      props.persistProfile(props.authorization, {
        ...props.profile,
        theme: 'theme_light',
      });
    } else {
      props.persistProfile(props.authorization, {
        ...props.profile,
        theme: 'theme_dark',
      });
    }
  };

  const changeTextSize = size => {
    props.persistProfile(props.authorization, {
      ...props.profile,
      textSize: size,
    });
  };

  const changeThemeColor = color => {
    props.persistProfile(props.authorization, {
      ...props.profile,
      themeColor: color,
    });
  };

  return (
    <>
      <div className="typography-3 space-top-4">Appearance</div>
      <div className="appearance">
        <div className="typography-5">Dark mode</div>
        <div>
          <Switch
            checked={props.profile.theme === 'theme_dark'}
            onChange={() => toggleDarkMode()}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </div>

        <div className="typography-5 space-bottom-2">Text Size</div>
        <div className=" space-bottom-2">
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
    </>
  );
};

export default Appearance;
