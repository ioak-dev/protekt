import React, { Component } from 'react';

interface Props {
    main?: any,
    side?: any
}

interface State {
}

class View extends Component<Props, State> {
    render() {
        return (
            <div>
               {/* {this.props} */}
               {this.props.children}
            </div>
        )
    }
}

export default View;