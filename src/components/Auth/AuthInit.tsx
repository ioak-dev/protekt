import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ReactCookieProps } from 'react-cookie';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';

interface Props extends ReactCookieProps {
  authorization: Authorization;
  addAuth: Function;
  getAuth: Function;
  removeAuth: Function;
}

const AuthInit = (props: Props) => {
  useEffect(() => {
    if (!props.authorization.isAuth) {
      console.log(props);
    }
    props.getAuth();
  }, [props.authorization.isAuth]);

  return <></>;
};

const mapStateToProps = state => ({
  authorization: state.authorization
});

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(
  AuthInit
);
