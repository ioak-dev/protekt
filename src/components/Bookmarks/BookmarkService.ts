import { httpPost } from '../Lib/RestTemplate';
import constants from '../Constants';

const importBookmarks = (data, authorization) => {
  console.log(data);
  return httpPost(
    constants.API_URL_BOOKMARK_IMPORT,
    data,
    {
      headers: {
        Authorization: `Bearer ${authorization.token}`,
      },
    },
    authorization.password
  ).then(function(response) {
    return Promise.resolve(response);
  });
};

export default importBookmarks;
