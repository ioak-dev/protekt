import { httpGet, httpPut, httpDelete } from '../components/Lib/RestTemplate';
import constants from '../components/Constants';
import { FETCH_BOOKMARK } from './types';
import { sendMessage } from '../events/MessageService';

const domain = 'bookmark';

export const fetchBookmark = authorization => dispatch => {
  httpGet(
    constants.API_URL_BOOKMARK,
    {
      headers: {
        Authorization: `Bearer ${authorization.token}`,
      },
    },
    authorization.password
  ).then(response => {
    dispatch({
      type: FETCH_BOOKMARK,
      payload: response.data,
    });
  });
};

export const saveBookmark = (authorization, payload) => dispatch => {
  httpPut(
    constants.API_URL_BOOKMARK,
    payload,
    {
      headers: {
        Authorization: `Bearer ${authorization.token}`,
      },
    },
    authorization.password
  )
    .then(() => {
      sendMessage(domain, true, { action: payload.id ? 'updated' : 'created' });
      dispatch(fetchBookmark(authorization));
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};

export const deleteBookmark = (authorization, id) => dispatch => {
  httpDelete(`${constants.API_URL_BOOKMARK}/${id}`, {
    headers: {
      Authorization: `Bearer ${authorization.token}`,
    },
  })
    .then(function(response) {
      if (response.status === 201) {
        sendMessage(domain, true, { action: 'deleted' });
        dispatch(fetchBookmark(authorization));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        sendMessage('session expired');
      }
    });
};
