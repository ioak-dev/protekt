import React, { Component } from 'react';
import { receiveMessage } from '../../events/MessageService';
import { Message } from '../Types/GeneralTypes';

interface Props {
}

interface State {
    backdrop: string
}

class Backdrop extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            backdrop: ''
        }
    }

    componentDidMount() {
        receiveMessage().subscribe(
            message => {
                if (message.name === 'dialog') {

                }
            }
        )
        // if (nextProps.event && nextProps.event.name === 'dialog') {
        //     if (nextProps.event.signal) {
        //         this.setState({
        //             backdrop: 'backdrop-fade'
        //         })
        //     } else {
        //         this.setState({
        //             backdrop: ''
        //         })
        //     }
        // }
    }

    render() {
        return (
            <div className={this.state.backdrop}></div>
        );
    }
}

export default Backdrop;