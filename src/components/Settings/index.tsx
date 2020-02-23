import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import {
  getProfile,
  setProfile,
  persistProfile
} from '../../actions/ProfileActions';
import './style.scss';
import View from '../../oakui/View';
import ViewResolver from '../../oakui/ViewResolver';
import { updateUserDetails } from '../Auth/AuthService';
import { Authorization, Profile } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import BookmarkImport from './BookmarkImport';
import BookmarkExport from './BookmarkExport';
import Appearance from './Appearance';
import UserDetails from './UserDetails';
import ChangePassword from './ChangePassword';

interface Props {
  profile: Profile;
  getProfile: Function;
  setProfile: Function;
  persistProfile: Function;
  authorization: Authorization;
  cookies: any;
}

const Settings = (props: Props) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(props.cookies.get('email'));
  }, []);

  const updateUserDetailsImpl = (user, type) => {
    updateUserDetails(
      {
        name: user?.name,
        email: user?.email,
        password: user?.password
      },
      props.authorization,
      type
    )
      .then((response: any) => {
        if (response.status === 201) {
          if (type === 'password') {
            sendMessage('notification', true, {
              message: 'Password updated successfully',
              type: 'success',
              duration: 3000
            });
          } else {
            props.cookies.set('name', user?.name);
            props.cookies.set('email', user?.email);
            sendMessage('notification', true, {
              message: 'User account updated successfully',
              type: 'success',
              duration: 3000
            });
          }
        } else {
          sendMessage('notification', true, {
            type: 'failure',
            message: 'Unknown error. Please try again or at a later time',
            duration: 3000
          });
        }
      })
      .catch(error => {
        sendMessage('notification', true, {
          type: 'failure',
          message: 'Unknown error. Please try again or at a later time',
          duration: 3000
        });
      });
  };

  return (
    <div className="settings">
      <ViewResolver sideLabel="More options">
        <View main>
          <BookmarkImport authorization={props.authorization} />
          <BookmarkExport authorization={props.authorization} email={email} />
          <Appearance
            authorization={props.authorization}
            profile={props.profile}
            persistProfile={props.persistProfile}
          />
          <UserDetails
            authorization={props.authorization}
            updateUserDetailsImpl={updateUserDetailsImpl}
          />
          <ChangePassword
            authorization={props.authorization}
            updateUserDetailsImpl={updateUserDetailsImpl}
            email={email}
          />
        </View>
      </ViewResolver>
    </div>
  );
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, {
  getProfile,
  setProfile,
  persistProfile
})(withCookies(Settings));
