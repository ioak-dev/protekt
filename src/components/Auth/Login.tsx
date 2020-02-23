import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import './Login.scss';
import {
  signup,
  signin,
  sentPasswordChangeEmail,
  preSignup,
  preSignin
} from './AuthService';
import { Authorization } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import { isEmptyOrSpaces } from '../Utils';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';

const queryString = require('query-string');

interface Props {
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  cookies: any;
  history: any;
  location: any;
  authorization: Authorization;
}

const Login = (props: Props) => {
  const [data, setData] = useState({
    newuser: false,
    name: '',
    email: '',
    password: '',
    resetCode: ''
  });

  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      if (query && query.type === 'signup') {
        setData({ ...data, newuser: true });
      }
    }
  }, []);

  const signinAction = event => {
    event.preventDefault();

    sendMessage('notification', false);
    sendMessage('spinner');
    if (data.email && data.password) {
      preSignin(data.email).then(response => {
        if (response.status === 200) {
          signin(
            {
              email: data.email,
              password: data.password
            },
            response.data
          )
            .then(response => {
              if (response.status === 200) {
                sendMessage('notification', true, {
                  message: 'Signed In successfully',
                  type: 'success',
                  duration: 3000
                });
                success(response.data, data.password);
              } else if (response.status === 401) {
                sendMessage('notification', true, {
                  message: 'Incorrect passphrase',
                  type: 'failure',
                  duration: 3000
                });
              } else {
                sendMessage('notification', true, {
                  message:
                    'Unknown response from server. Please try again or at a later time',
                  type: 'failure',
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
        } else if (response.status === 404) {
          sendMessage('notification', true, {
            message: 'User name does not exist',
            type: 'failure',
            duration: 3000
          });
        }
      });
    } else {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Username/password cannot be empty',
        duration: 3000
      });
    }
  };

  const signupAction = event => {
    event.preventDefault();
    sendMessage('notification', false);
    sendMessage('spinner');
    if (data.name && data.password && data.email) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
        sendMessage('notification', true, {
          type: 'failure',
          message: 'Email ID is invalid',
          duration: 3000
        });
        return;
      }
      preSignup().then(response => {
        if (response.status === 200) {
          signup({
            name: data.name,
            password: data.password,
            email: data.email,
            solution: response.data.solution,
            salt: response.data.salt
          }).then(status => {
            if (status === 200) {
              sendMessage('notification', true, {
                type: 'success',
                message: 'Your account has been created. You can login now',
                duration: 3000
              });
              setData({ ...data, newuser: !data.newuser });
            }
          });
        }
      });
    } else if (!data.name) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Name cannot be empty',
        duration: 3000
      });
    } else if (!data.email) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Email cannot be empty',
        duration: 3000
      });
    } else if (!data.password) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Password cannot be empty',
        duration: 3000
      });
    }
  };

  const sentEmailWithCode = () => {
    if (isEmptyOrSpaces(data.email)) {
      sendMessage('notification', true, {
        message: 'Email cannot be empty',
        type: 'failure',
        duration: 5000
      });
      return;
    }

    sentPasswordChangeEmailAction('password');
  };

  const sentPasswordChangeEmailAction = type => {
    const min = 1;
    const max = 100;
    const rand = min + Math.random() * (max - min);
    sentPasswordChangeEmail(
      {
        email: data.email,
        resetCode: rand
      },
      type
    )
      .then((response: any) => {
        if (response === 200) {
          if (type === 'password') {
            sendMessage('notification', true, {
              message: 'Password sent successfully',
              type: 'success',
              duration: 3000
            });
          }
        } else {
          sendMessage('notification', true, {
            type: 'failure',
            message: 'Invalid Email error',
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

  const handleChange = event => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
  };

  const toggle = () => {
    setData({ ...data, newuser: !data.newuser });
  };

  const success = (data, password) => {
    props.addAuth({
      isAuth: true,
      token: data.token,
      secret: data.secret,
      name: data.name,
      email: data.email,
      password: password
    });
    sendMessage('loggedin', true);
    props.history.push('/home');
  };

  return (
    <div className="login">
      {!data.newuser && (
        <div className="container">
          <form method="GET" onSubmit={signinAction} noValidate>
            <h1>Log In</h1>
            <div className="form">
              <OakText
                label="Username/e-mail"
                id="email"
                data={data}
                handleChange={e => handleChange(e)}
              />
              <OakText
                label="Password"
                id="password"
                type="password"
                data={data}
                handleChange={e => handleChange(e)}
              />
            </div>
            <br />
            <OakButton
              theme="primary"
              variant="animate in"
              action={signinAction}
            >
              Sign In
            </OakButton>
            <br />
            <br />
            Don&apos;t have an account? &nbsp;{' '}
            <OakButton theme="secondary" variant="outline" action={toggle}>
              Sign Up
            </OakButton>
            <br />
            <br />
          </form>

          <OakButton action={sentEmailWithCode}>Forgot password ?</OakButton>
        </div>
      )}

      {data.newuser && (
        <div className="container">
          <form method="GET" onSubmit={signupAction} noValidate>
            <h1>Sign Up</h1>
            <div className="form">
              <OakText
                label="Name"
                id="name"
                data={data}
                handleChange={e => handleChange(e)}
              />
              <OakText
                label="Email / User Name"
                id="email"
                data={data}
                handleChange={e => handleChange(e)}
              />
              <OakText
                label="Password"
                id="password"
                type="password"
                data={data}
                handleChange={e => handleChange(e)}
              />
            </div>
            <br />
            <OakButton
              theme="primary"
              variant="animate in"
              action={signupAction}
            >
              Create account
            </OakButton>
            <br />
            <br />
            Already have a account? &nbsp;{' '}
            <OakButton theme="secondary" variant="outline" action={toggle}>
              Sign In
            </OakButton>
          </form>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  authorization: state.authorization
});

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(
  withCookies(Login)
);
