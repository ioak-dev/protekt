import React from 'react';
import './style.scss';
import cover from '../../images/cover.jpg';

import { sendMessage, receiveMessage } from '../../events/MessageService';

interface Props {
  setProfile: Function,
  profile: any,
  match: any
}

interface State {
}

export default class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    sendMessage('navbar-transparency', true);
  }

  componentWillUnmount() {
    sendMessage('navbar-transparency', false);
  }

  render() {
    return (
      <>
        <div className="home full">
            <div className='cover'>
              <img src={cover}/>
            </div>
            Test content
        </div>
      </>
    );
  }
}