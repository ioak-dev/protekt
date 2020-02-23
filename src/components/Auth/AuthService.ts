import sjcl from 'ioak-sjcl';
import CryptoJS from 'crypto-js';
import { httpGet, httpPost, httpPut } from '../Lib/RestTemplate';
import constants from '../Constants';

export function preSignup() {
  return httpGet(constants.API_URL_PRESIGNUP, null).then(function(response) {
    return Promise.resolve(response);
  });
}

export function signup(data) {
  return httpPost(
    constants.API_URL_SIGNUP,
    {
      name: data.name,
      email: data.email,
      problem: encrypt(data.password, data.solution, data.salt),
      solution: data.solution
    },
    null
  ).then(function(response) {
    return Promise.resolve(response.status);
  });
}

export function preSignin(email) {
  return httpGet(constants.API_URL_PRESIGNIN + email, null)
    .then(response => Promise.resolve(response))
    .catch(error => Promise.resolve(error.response));
}

export function signin(data, problem) {
  try {
    const solution = decrypt(data.password, JSON.stringify(problem));
    return httpPost(
      constants.API_URL_SIGNIN,
      {
        email: data.email,
        solution
      },
      null
    ).then(function(response) {
      return Promise.resolve(response);
    });
  } catch (error) {
    if (error.message === "ccm: tag doesn't match") {
      return Promise.resolve({
        status: 401
      });
    }
    return Promise.resolve(error);
  }
}

export function updateUserDetails(data, authorization, type) {
  console.log(data, authorization);
  return httpGet(constants.API_URL_PRESIGNUP, null).then(function(response) {
    if (response.status === 200) {
      let newData = {};
      if (type && type === 'password') {
        newData = {
          problem: encrypt(
            data.password,
            response.data.solution,
            response.data.salt
          ),
          solution: response.data.solution
        };
      } else {
        newData = {
          name: data.name,
          email: data.email
        };
      }

      return httpPut(
        constants.API_URL_USER_DETAILS,
        newData,
        {
          headers: {
            Authorization: `Bearer ${authorization.token}`
          }
        },
        authorization.password,
        ['problem', 'solution', 'email', 'name']
      ).then(function(response) {
        return Promise.resolve(response);
      });
    }
  });
}

export function sentPasswordChangeEmail(data, type) {
  return httpPost(constants.API_URL_CODE, data, null).then(function(response) {
    return Promise.resolve(response.status);
  });
}

export function resetPassword(data, type) {
  return httpGet(constants.API_URL_PRESIGNUP, null).then(function(response) {
    if (response.status === 200) {
      let newData = {};
      if (type && type === 'password') {
        newData = {
          problem: encrypt(
            data.password,
            response.data.solution,
            response.data.salt
          ),
          solution: response.data.solution,
          resetCode: data.resetCode
        };
      }

      return httpPost(constants.API_URL_RESET, newData, null).then(function(
        response
      ) {
        return Promise.resolve(response.status);
      });
    }
  });
}

function encrypt(password, message, salt) {
  const config = {
    cipher: 'aes',
    iter: '12000',
    ks: 256,
    salt: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(salt))
  };
  return sjcl.encrypt(password, message, config);
}

function decrypt(password, ciphertext) {
  return sjcl.decrypt(password, ciphertext);
}
