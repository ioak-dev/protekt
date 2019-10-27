import React, { Component } from 'react';
import './ArcDialog.scss';
import { sendMessage } from '../../events/MessageService';

interface Props {
    visible: boolean,
    title: string,
    toggleVisibility: any
}

interface State {

}

class ArcDialog extends Component<Props, State> {
    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible) {
            if (nextProps.visible) {
                sendMessage('dialog');
                window.scrollTo(500, 0);
            } else {
                sendMessage('dialog', false);
            }
        }
    }
    render() {
        return (
            <>
            <div className="dialog-outer">
                <div className={(this.props.visible ? "dialog show" : "dialog hide")}>
                    {this.props.title && <div className="header">{this.props.title}<i className="material-icons" onClick={this.props.toggleVisibility}>close</i></div>}
                    <div className="container">
                        {this.props.children}
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default ArcDialog;