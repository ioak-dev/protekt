import React, { Component } from 'react';
import ActionButton from '../../oakui/ActionButton';
import './style.scss';
const removeMd = require('remove-markdown');

interface Props {
  selectNote: Function;
  note: any;
  id: string;
  selected: boolean;
  showTag: boolean;
}
interface State {}
class NoteRef extends Component<Props, State> {
  selectNote = () => {
    this.props.selectNote(this.props.id);
  };

  render() {
    const tags: any = [];
    if (this.props.note.tags) {
      this.props.note.tags.split(' ').map(item => {
        tags.push(<ActionButton leftLabel={item}></ActionButton>);
      });
    }
    return (
      <>
        <div
          className={this.props.selected ? 'noteref selected' : 'noteref'}
          onClick={this.selectNote}
        >
          <div className="content">
            {this.props.note.flag && (
              <div className={'flag-palette ' + this.props.note.flag} />
            )}
            {this.props.showTag && (
              <div className="notebook">
                {/* <i className="material-icons">insert_drive_file</i> */}
                {this.props.note.notebook}
              </div>
            )}
            <div className="title">{this.props.note.title}</div>
            <div className="space-bottom-0" />
            <div className="detail">
              {removeMd(this.props.note.content.substring(0, 100))}
            </div>
            {/* <div className="detail typography-5"><Showdown source={this.props.note.content.substring(0, 150)} /></div> */}
          </div>
        </div>
        <div className="separator" />
        {/* <hr /> */}
      </>
    );
  }
}

export default NoteRef;
