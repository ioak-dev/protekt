import React from 'react';

import './style.scss';
import { NavLink } from 'react-router-dom';
import { Authorization, Profile } from '../Types/GeneralTypes';

interface Props {
  authorization: Authorization;
  profile: Profile;
}

const Links = (props: Props) => {
  return (
    <div className="links">
      {props.authorization.isAuth && (
        <>
          <NavLink to="/bookmarks" className="navitem" activeClassName="active">
            Bookmarks
          </NavLink>
          <NavLink to="/notes" className="navitem" activeClassName="active">
            Notes
          </NavLink>
          <NavLink to="/settings" className="navitem" activeClassName="active">
            Settings
          </NavLink>
          <NavLink to="/help" className="navitem" activeClassName="active">
            Help
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Links;
