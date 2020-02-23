import React, { useEffect } from 'react';
import './style.scss';

import { sendMessage } from '../../events/MessageService';
import { Profile } from '../Types/GeneralTypes';

interface Props {
  setProfile: Function;
  profile: Profile;
  match: any;
  logout: Function;
}

interface State {}

const Home = (props: Props) => {
  useEffect(() => {
    sendMessage('navbar-transparency');
    return () => sendMessage('navbar-transparency', false);
  }, []);

  return (
    <>
      <div className="home">
        {/* <div className="section parallax bg1" />
        <div className="section static bg1 odd">
          <h3>A bookmarking app like never before</h3>
          <p>Take your link to the web wherever you go, with the most secure bookmark and note taking app</p>
          <br />
          <p><NavLink to="/login" className="navitem" activeClassName="active">Sign up</NavLink>&nbsp;for free</p>
        </div> */}

        <div className="section parallax bg bg2" />
        <div className="section static bg2 even">
          <h3>Secured suite of applications</h3>
          <p>Designed with security as a primary factor from ground up</p>
          <p>Your passwords never leaves your workstation</p>
          <p>Our servers have zero knowledge about your password</p>
        </div>

        {/* <div className="section parallax bg3" />
        <div className="section static bg3 odd">
          <h3>Premium features</h3>
          <p>Get premium features free for lifetime. We standby free software for all</p>
        </div>

        <div className="section parallax bg4" />
        <div className="section static bg4 even">
          <h3>Don't mix up personal and business</h3>
          <p>With the help of workspaces, you can now work in isolated containers</p>
        </div>

        <div className="section parallax bg5" />
        <div className="section static bg5 odd">
          <h3>We love open source</h3>
          <p>Our codebase is 100% available for the community to do peer review and audit for any security flaws</p>
        </div>

        <div className="section parallax bg6" />
        <div className="section static bg6 even">
          <h3>Clean clutter free interface</h3>
          <p>Modern interface with a clutter free design to keep you in focus on your activity</p>
        </div>

        <div className="section parallax bg7" />
        <div className="section static bg7 odd">
          <h3>Travel to the future</h3>
          <p>We are evolving for the future. More features on the way. You can watch our roadmap here</p>
        </div> */}
      </div>
    </>
  );
};

export default Home;
