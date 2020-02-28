import React, { useState, useEffect } from 'react';
import './style.scss';
import { isEmptyOrSpaces } from '../Utils';
import { Authorization } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';

interface Props {
  updateUserDetailsImpl: Function;
  authorization: Authorization;
}

const UserDetails = (props: Props) => {
  const [data, setData] = useState({
    name: '',
    email: '',
  });

  const handleChange = event => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
  };

  const updateUserDetailsAction = () => {
    if (isEmptyOrSpaces(data.name)) {
      sendMessage('notification', true, {
        message: 'Name not provided',
        type: 'failure',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(data.email)) {
      sendMessage('notification', true, {
        message: 'Email not provided',
        type: 'failure',
        duration: 5000,
      });
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Email ID is invalid',
        duration: 3000,
      });
      return;
    }

    props.updateUserDetailsImpl(data, 'user');
  };

  return (
    <>
      <div className="typography-3 space-top-4">User Account</div>
      <div>
        <OakText
          label="Name"
          data={data}
          id="name"
          handleChange={e => handleChange(e)}
        />
      </div>
      <div>
        <OakText
          label="Email"
          data={data}
          id="email"
          handleChange={e => handleChange(e)}
        />
      </div>
      <div>
        <OakButton
          theme="secondary"
          variant="animate in"
          action={() => updateUserDetailsAction()}
        >
          Update details
        </OakButton>
      </div>
    </>
  );
};

export default UserDetails;
