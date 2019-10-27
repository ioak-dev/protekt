import React, { Component } from 'react';
import './style.scss';
import { receiveMessage, sendMessage } from '../../events/MessageService';

interface Props {
}

interface State {
    notification: any,
    spinner: boolean
}

class Notification extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            spinner: false,
            notification: null
        }
    }
    componentWillMount() {
        receiveMessage().subscribe(message => {
            if (message.name === 'notification') {
                if (!message.signal) {
                    this.setState({
                        notification: null,
                    })
                } else {
                    this.setState({
                        notification: message.data,
                        spinner: false
                    })
                    
                    if (message.data && message.data.duration) {
                        setTimeout(() => {
                            sendMessage('notification', false);
                        }, message.data.duration);
                    }
                }
            }

            if (message.name === 'spinner') {
                this.setState({
                    spinner: message.signal
                })
            }
        });
    }

    render() {
        return (
            <>
            {this.state.notification && <div className={"notification " + this.state.notification.type}><div className="message">{this.state.notification.message}</div></div>}
            {this.state.spinner && <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
            {/* {this.props.spinner && <div className="lds-facebook"><div></div><div></div><div></div></div>} */}
            {/* {this.props.spinner && <div className="lds-dual-ring"></div>} */}
            </>
        );
    }
}

export default Notification;