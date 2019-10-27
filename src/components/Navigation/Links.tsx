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
                    <NavLink to={"/home"} className="navitem" activeClassName="active">Home</NavLink>
                    <NavLink to={"/login"} className="navitem" activeClassName="active">Login</NavLink>
                    </>
                }
            </div>
        );
    }
}

export default Links;