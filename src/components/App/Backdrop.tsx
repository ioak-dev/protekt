import React, { Component } from 'react';
import { receiveMessage } from '../../events/MessageService';

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
                    if (message.signal) {
                        this.setState({backdrop: 'backdrop-fade'});
                    } else {
                        this.setState({backdrop: ''});
                    }
                }
            }
        )
    }

    render() {
        return (
            <div className={this.state.backdrop}></div>
        );
    }
}

export default Backdrop;