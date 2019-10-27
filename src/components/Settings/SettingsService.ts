import { httpPost } from "../Lib/RestTemplate";
import { constants } from '../Constants';

export function sendBookmarkExportEmail(data, token) {

    return httpPost(constants.API_URL_MAIL, data,
        {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(function(response) {
            return Promise.resolve(response.status);
        })
}
