import React, { Component } from 'react';
import './OakDialog.scss';
import { sendMessage } from '../events/MessageService';
import OakDialog from './OakDialog';
import OakButton from './OakButton';

interface Props {
  visible: boolean;
  toggleVisibility: any;
  action: any;
  text?: string;
}

interface State {}

class OakPrompt extends Component<Props, State> {
  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      if (this.props.visible) {
        this.props.toggleVisibility();
      }
    }
  };

  action = () => {
    this.props.action();
    this.props.toggleVisibility();
  };

  render() {
    return (
      <OakDialog
        small
        visible={this.props.visible}
        toggleVisibility={this.props.toggleVisibility}
      >
        <div className="dialog-body typography-4 space-top-4 space-bottom-4">
          {this.props.text
            ? this.props.text
            : 'Are you sure you want to continue?'}
        </div>
        <div className="dialog-footer">
          {this.props.children && this.props.children}
          {!this.props.children && (
            <>
              <OakButton
                action={this.props.toggleVisibility}
                theme="default"
                variant="animate in"
                align="left"
              >
                <i className="material-icons">close</i>No
              </OakButton>
              <OakButton
                action={this.action}
                theme="primary"
                variant="animate out"
                align="right"
              >
                <i className="material-icons">double_arrow</i>Yes
              </OakButton>
            </>
          )}
        </div>
      </OakDialog>
    );
  }
}

export default OakPrompt;
