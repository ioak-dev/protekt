import { httpGet, httpPut, httpDelete } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';
import { FETCH_NOTE } from './types';
import { sendMessage } from '../events/MessageService';

const domain = 'note';

export const fetchNote = authorization => dispatch => {
  httpGet(constants.API_URL_NOTE, {
    headers: {
      Authorization: `Bearer ${authorization.token}`,
    },
  }).then(response => {
    dispatch({
      type: FETCH_NOTE,
      payload: response.data,
    });
  });
};

export const saveNote = (authorization, payload) => dispatch => {
  if (payload._id) {
    payload.id = payload._id;
    payload._id = undefined;
  }
  httpPut(constants.API_URL_NOTE, payload, {
    headers: {
      Authorization: `Bearer ${authorization.token}`,
    },
  })
    .then(() => {
      sendMessage(domain, true, { action: payload.id ? 'updated' : 'created' });
      dispatch(fetchNote(authorization));
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};

export const deleteNote = (authorization, id) => dispatch => {
  httpDelete(`${constants.API_URL_NOTE}/${id}`, {
    headers: {
      Authorization: `Bearer ${authorization.token}`,
    },
  })
    .then(function(response) {
      if (response.status === 201) {
        sendMessage(domain, true, { action: 'deleted' });
        dispatch(fetchNote(authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};
