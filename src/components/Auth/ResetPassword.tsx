import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import './Login.scss';
import { resetPassword } from './AuthService';
import { sendMessage } from '../../events/MessageService';
import { isEmptyOrSpaces } from '../Utils';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';

const queryString = require('query-string');

interface Props {
  history: any;
  location: any;
}

const ResetPassword = (props: Props) => {
  const [data, setData] = useState({
    password: '',
    repeatPassword: '',
    resetCode: ''
  });

  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      if (query.code) {
        setData({ ...data, resetCode: query.code });
      } else {
        props.history.push('/home');
      }
    }
  });

  const handleChange = event => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
  };

  const changePassword = () => {
    if (isEmptyOrSpaces(data.password)) {
      sendMessage('notification', true, {
        message: 'password not provided',
        type: 'failure',
        duration: 5000
      });
      return;
    }

    if (
      isEmptyOrSpaces(data.repeatPassword) ||
      isEmptyOrSpaces(data.repeatPassword)
    ) {
      sendMessage('notification', true, {
        message: 'Repeat password not provided',
        type: 'failure',
        duration: 5000
      });
      return;
    }

    if (data.password !== data.repeatPassword) {
      sendMessage('notification', true, {
        message: 'Password is not matching',
        type: 'failure',
        duration: 5000
      });
      return;
    }

    resetPasswordAction('password');
  };

  const resetPasswordAction = type => {
    resetPassword(
      {
        password: data.password,
        resetCode: data.resetCode
      },
      type
    )
      .then((response: any) => {
        if (response === 200) {
          if (type === 'password') {
            sendMessage('notification', true, {
              message: 'Password Changed successfully',
              type: 'success',
              duration: 3000
            });
          }
        } else {
          sendMessage('notification', true, {
            type: 'failure',
            message: 'Invalid request',
            duration: 3000
          });
        }
      })
      .catch(error => {
        sendMessage('notification', true, {
          type: 'failure',
          message: 'Bad request',
          duration: 3000
        });
      });
  };

  return (
    <div className="login">
      <div className="container">
        <form method="GET" onSubmit={changePassword} noValidate>
          <h1>Reset password</h1>
          <div className="form">
            <OakText
              label="Password"
              id="password"
              type="password"
              data={data}
              handleChange={e => handleChange(e)}
            />
            <OakText
              label="Repeat Password"
              id="repeatPassword"
              type="password"
              data={data}
              handleChange={e => handleChange(e)}
            />
          </div>
          <br />
          <OakButton
            theme="primary"
            variant="animate in"
            action={changePassword}
          >
            Submit
          </OakButton>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  authorization: state.authorization
});

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(
  ResetPassword
);
