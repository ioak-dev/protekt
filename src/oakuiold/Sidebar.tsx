import React, { Component } from 'react';
import './Sidebar.scss';
import { sendMessage, receiveMessage } from '../events/MessageService';

interface Props {
  show?: boolean;
  elements?: Array<string>;
  label: string;
  icon: string;
  number?: number;
  animate?: boolean;
}

interface State {
  show: boolean;
  elements: Array<string>;
}

class Sidebar extends Component<Props, State> {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show ? true : false,
      elements: this.props.elements ? this.props.elements : []
    };
  }

  toggle = () => {
    this.setState(
      {
        show: !this.state.show
      },
      () =>
        sendMessage('sidebarExpanded', this.state.show, {
          label: this.props.label
        })
    );
  };

  hide = () => {
    this.setState({
      show: false
    });
  };

  componentDidMount() {
    this._isMounted = true;
    receiveMessage().subscribe(message => {
      if (this._isMounted) {
        if (
          message.name === 'sidebarExpanded' &&
          message.signal &&
          message.data &&
          message.data.label !== this.props.label
        ) {
          this.setState({
            show: false
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const elements = this.state.elements.map((item: any) => (
      <div key={item.label} className="element" onClick={item.action}>
        <i className="material-icons">{item.icon}</i>
        {item.label}
      </div>
    ));
    return (
      <div className="sidebar">
        <div
          className={this.state.show ? 'header active' : 'header'}
          onClick={this.toggle}
        >
          <div className="label">
            <i className="material-icons">{this.props.icon}</i>
            {this.props.label}
            {this.props.number !== undefined && (
              <div className="number">{this.props.number}</div>
            )}
          </div>
          {/* <div className="aria"><i className="material-icons">{this.state.show ? 'expand_less' : 'expand_more'}</i></div> */}
          <div className="aria">
            <i
              className={
                this.state.show ? 'material-icons collapse' : 'material-icons'
              }
            >
              keyboard_arrow_left
            </i>
          </div>
        </div>
        <div
          className={
            this.state.show
              ? 'content show ' + (this.props.animate ? 'animate' : 'static')
              : 'content hide ' + (this.props.animate ? 'animate' : 'static')
          }
        >
          {elements}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Sidebar;
