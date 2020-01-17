import React, { Component } from 'react';
import './oak-button-notch.scss';

interface Props {
    icon?: string,
    action?: any,
    variant?: 'block' | 'outline' | 'animate in' | 'animate out' | 'animate none' | 'disabled'
    theme?: 'primary' | 'secondary' | 'tertiary' | 'default',
    align?: 'left' | 'right' | 'center',
    small?: boolean,
    invert?: boolean
}

interface State {
}

class OakButton extends Component<Props, State> {    

    constructor (props: Props) {
        super(props);
        this.state = {
            menuActive: false
        }
    }

    getStyle = () => {
        let style = this.props.theme ? this.props.theme : "";
        style = style + (this.props.variant ? " " + this.props.variant : "");

        if (!this.props.children) {
            style = style + " icon";
        }

        style = style + (this.props.invert ? " invert": "");

        style = style + (this.props.small ? " small" : "");

        style = style + (this.props.align ? " align-" + this.props.align : "");

        return style;
    }

    render() {
        return (
            <button className={"oak-button " + this.getStyle()} onClick={this.props.action}>
                {this.props.icon && <i className="material-icons">{this.props.icon}</i>}
                {this.props.children && this.props.children}
            </button>
        )
    }
}

export default OakButton;