import React from 'react';
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

const NoteLink = (props: Props) => {
  const selectNote = () => {
    props.selectNote(props.id);
  };

  const tags: any = [];
  if (props.note.tags) {
    props.note.tags.split(' ').map(item => {
      tags.push(<ActionButton leftLabel={item} />);
    });
  }
  return (
    <>
      <div
        className={props.selected ? 'notelink selected' : 'notelink'}
        onClick={selectNote}
      >
        <div className="content">
          {props.note.flag && (
            <div className={`flag-palette ${props.note.flag}`} />
          )}
          {props.showTag && (
            <div className="notebook">
              {/* <i className="material-icons">insert_drive_file</i> */}
              {props.note.notebook}
            </div>
          )}
          <div className="title">{props.note.title}</div>
          <div className="space-bottom-0" />
          {props.note.type !== 'Artboard' && (
            <div className="detail">
              {removeMd(props.note.content.substring(0, 100))}
            </div>
          )}
          {props.note.type === 'Artboard' && (
            <div className="detail-artboard">
              <i className="material-icons">tv</i>
            </div>
          )}
          {/* <div className="detail typography-5"><Showdown source={props.note.content.substring(0, 150)} /></div> */}
        </div>
      </div>
      <div className="separator" />
      {/* <hr /> */}
    </>
  );
};

export default NoteLink;
