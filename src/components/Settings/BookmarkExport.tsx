import React from 'react';
import './style.scss';
import { Authorization } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import { httpGet } from '../Lib/RestTemplate';
import constants from '../Constants';
import sendBookmarkExportEmail from './SettingsService';
import OakButton from '../../oakui/OakButton';

interface Props {
  authorization: Authorization;
  email: string;
}

const BookmarkExport = (props: Props) => {
  const exportBookmark = () => {
    httpGet(
      constants.API_URL_BOOKMARK,
      {
        headers: {
          Authorization: `Bearer ${props.authorization.token}`
        }
      },
      props.authorization.password
    ).then(response => {
      let staticContent =
        '<META HTTP-EQUIV="Content-Type" CONTENT="text/html;' +
        ' charset=UTF-8"><TITLE>Bookmarks</TITLE><H1>Bookmarks</H1>';

      response.data.map(function(bookmark) {
        const htmlContent =
          `${'<DL><p>' + '<DT>' + '<A ' + 'HREF="'}${bookmark.href}">${
            bookmark.title
          }</A>` + `</DL><p>`;
        staticContent += htmlContent;
      });

      console.log(staticContent);
      sendExportEmail(staticContent);
    });
  };

  const sendExportEmail = staticContent => {
    sendBookmarkExportEmail(
      {
        email: props.email,
        content: staticContent
      },
      {
        headers: {
          Authorization: `Bearer ${props.authorization.token}`
        }
      }
    )
      .then((response: any) => {
        if (response === 200) {
          sendMessage('notification', true, {
            message: 'Check your mail for bookmark attachment',
            type: 'success',
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
    <>
      <div className="typography-3 space-top-4">Export Bookmarks</div>
      <div className="space-top-2">
        <OakButton
          theme="secondary"
          variant="animate in"
          action={() => exportBookmark()}
        >
          Export
        </OakButton>
      </div>
    </>
  );
};

export default BookmarkExport;
