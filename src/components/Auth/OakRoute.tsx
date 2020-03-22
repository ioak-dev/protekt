import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';
import AuthInit from './AuthInit';
import Home from '../Home';

interface Props {
  authorization: Authorization;
  getAuth: Function;
  path: string;
  render: any;
  profile: any;
  setProfile: Function;
  getProfile: Function;
  component: any;
}

const OakRoute = ({
  profile: profile,
  getProfile: getProfile,
  setProfile: setProfile,
  component: ChildComponent,
  ...rest
}) => {
  useEffect(() => {
    // if (profile.appStatus === 'notmounted' && !profile.loginPage) {
    //   setProfile({ tenant: rest.match.params.tenant, appStatus: 'mounted' });
    // } else {
    //   setProfile({ tenant: rest.match.params.tenant });
    // }
    middlewares(rest.middleware);
  }, []);

  useEffect(() => {
    middlewares(rest.middleware);
  }, [profile.appStatus]);

  const middlewares = layers => {
    // if (profile.appStatus === 'authenticated') {
    layers?.forEach(middlewareName => {
      runMidleware(middlewareName);
    });
    // }
  };

  const runMidleware = middlewareName => {
    switch (middlewareName) {
      case 'isAuthenticated':
        return isAuthenticated();
      case 'isAdmin':
        return isAdmin();
    }
  };

  const isAuthenticated = () => {
    if (rest.authorization.isAuth) {
      return true;
    } else {
      redirectToLogin();
      return false;
    }
  };

  const isAdmin = () => {
    redirectToUnauthorized();
    return false;
  };

  const redirectToLogin = () => {
    window.location.href = `http://localhost:3000/#/curate/login?appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };

  const redirectToUnauthorized = () => {
    rest.history.push(`/unauthorized`);
  };

  return (
    <>
      <AuthInit
        profile={profile}
        redirectIfNotAuthenticated={
          rest.middleware && rest.middleware.indexOf('isAuthenticated') !== -1
        }
      />
      {(!rest.middleware ||
        rest.middleware.indexOf('isAuthenticated') === -1 ||
        // profile.appStatus === 'authenticated' &&
        rest.authorization.isAuth) && (
        <ChildComponent
          {...rest}
          profile={profile}
          getProfile={getProfile}
          setProfile={setProfile}
        />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  authorization: state.authorization,
});

export default connect(mapStateToProps, { getAuth })(OakRoute);
