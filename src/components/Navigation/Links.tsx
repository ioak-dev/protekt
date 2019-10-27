import React, { Component } from 'react';

import './style.scss';
import { NavLink } from 'react-router-dom';
import { Authorization, Profile } from '../Types/GeneralTypes';

interface Props {
    authorization: Authorization,
    profile: Profile
}

interface State {
    menu: boolean
}

class Links extends Component<Props, State> {
    toggleMenu = () => {
        this.setState({
            menu: !this.state.menu
        })
    }

    render() {
        return (
            <div className="links">
                {this.props.authorization.isAuth &&
                    <>
                    <NavLink to="/bookmarks" className="navitem" activeClassName="active">Bookmarks</NavLink>
                    <NavLink to="/notes" className="navitem" activeClassName="active">Notes</NavLink>
                    <NavLink to="/settings" className="navitem" activeClassName="active">Settings</NavLink>
                    <NavLink to="/help" className="navitem" activeClassName="active">Help</NavLink>
                    </>
                }
            </div>
        );
    }
}

export default Links;