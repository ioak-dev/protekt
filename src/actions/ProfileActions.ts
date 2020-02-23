import { httpGet, httpPut } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';
import { GET_PROFILE, SET_PROFILE } from './types';

export const getProfile = () => dispatch => {
  dispatch({
    type: GET_PROFILE
  });
};

export const reloadProfile = authorization => dispatch => {
  httpGet(
    constants.API_URL_PREFERENCES,
    {
      headers: {
        Authorization: 'Bearer ' + authorization.token
      }
    },
    authorization.password
  ).then(function(response) {
    console.log(response);
    dispatch({
      type: SET_PROFILE,
      payload: response.data
    });
  });
};

export const persistProfile = (authorization, payload) => dispatch => {
  httpPut(
    constants.API_URL_PREFERENCES,
    payload,
    {
      headers: {
        Authorization: 'Bearer ' + authorization.token
      }
    },
    authorization.password
  ).then(function(response) {
    dispatch({
      type: SET_PROFILE,
      payload: response.data
    });
  });
};

export const setProfile = payload => dispatch => {
  dispatch({
    type: SET_PROFILE,
    payload: payload
  });
};
