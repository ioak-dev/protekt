import { httpGet, httpPut } from '../Lib/RestTemplate';
import constants from '../Constants';

export default function migrateDataWithNewPassword(
  authorization,
  oldPassword,
  newPassword
) {
  migrateBookmarks(authorization, oldPassword, newPassword);
  migrateNotes(authorization, oldPassword, newPassword);
}

function migrateBookmarks(authorization, oldPassword, newPassword) {
  httpGet(
    constants.API_URL_BOOKMARK,
    {
      headers: {
        Authorization: `Bearer ${authorization.token}`,
      },
    },
    oldPassword
  ).then(response => {
    response.data.forEach(element => {
      element.id = element._id;
      delete element._id;
      httpPut(
        constants.API_URL_BOOKMARK,
        element,
        {
          headers: {
            Authorization: `Bearer ${authorization.token}`,
          },
        },
        newPassword
      ).then(innerResponse => console.log(innerResponse));
    });
  });
}

function migrateNotes(authorization, oldPassword, newPassword) {
  httpGet(
    constants.API_URL_NOTE,
    {
      headers: {
        Authorization: `Bearer ${authorization.token}`,
      },
    },
    oldPassword
  ).then(response => {
    response.data.forEach(element => {
      element.id = element._id;
      delete element._id;
      httpPut(
        constants.API_URL_NOTE,
        element,
        {
          headers: {
            Authorization: `Bearer ${authorization.token}`,
          },
        },
        newPassword
      ).then(innerResponse => console.log(innerResponse));
    });
  });
}
