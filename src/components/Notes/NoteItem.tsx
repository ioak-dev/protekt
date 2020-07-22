import React, { useState } from 'react';
import Showdown from '../../oakui/Showdown';
import OakSelect from '../../oakui/OakSelect';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import OakPrompt from '../../oakui/OakPrompt';
import OakEditor from '../../oakui/OakEditor';

interface Props {
  note: any;
  deleteNote: Function;
  saveNote: Function;
  handleChange: Function;
  notebooks: any;
  editNote: boolean;
  setEditNote: Function;
}

const NoteItem = (props: Props) => {
  // const flags = [
  //   {
  //     key: 'one',
  //     value: <div className="select-palette one" />,
  //   },
  //   {
  //     key: 'two',
  //     value: <div className="select-palette two" />,
  //   },
  //   {
  //     key: 'three',
  //     value: <div className="select-palette three" />,
  //   },
  //   {
  //     key: 'four',
  //     value: <div className="select-palette four" />,
  //   },
  //   {
  //     key: 'five',
  //     value: <div className="select-palette five" />,
  //   },
  //   {
  //     key: 'six',
  //     value: <div className="select-palette six" />,
  //   },
  // ];

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [preview, setPreview] = useState(true);

  const deleteNote = () => {
    props.deleteNote(props.note._id || props.note.id);
  };

  const saveNote = () => {
    let { notebook } = props.note;

    if (notebook === '<create new>') {
      notebook = props.note.newNotebook;
    }

    props.saveNote(props.note, true);
  };
  const tags: any = [];
  if (props.note.tags) {
    props.note.tags.split(' ').map(item => {
      tags.push(
        <div key={item} className="tag">
          {item}
        </div>
      );
    });
  }

  return (
    <>
      <OakPrompt
        visible={showDeletePrompt}
        toggleVisibility={() => setShowDeletePrompt(!showDeletePrompt)}
        action={deleteNote}
        text="Are you sure, you want to delete the bookmark?"
      />
      {!props.editNote && (
        <div className="noteitem">
          <div className="notebook">
            <i className="material-icons">insert_drive_file</i>
            {props.note.notebook}
          </div>
          {/* <div className="space-bottom-2" /> */}
          <div className="typography-3 space-bottom-1">{props.note.title}</div>
          {tags}
          <div className="space-bottom-2" />
          <OakButton
            action={() => props.setEditNote(true)}
            theme="secondary"
            variant="appear"
            align="left"
          >
            <i className="material-icons">edit</i>Edit
          </OakButton>
          <OakButton
            action={() => setShowDeletePrompt(!showDeletePrompt)}
            theme="secondary"
            variant="appear"
            align="right"
          >
            <i className="material-icons">delete</i>Delete
          </OakButton>

          <Showdown source={props.note.content} />
        </div>
      )}

      {props.editNote && (
        <div className="noteitem">
          <div className="typography-3 space-bottom-1">{props.note.title}</div>

          <OakButton
            action={saveNote}
            theme="primary"
            variant="appear"
            align="left"
          >
            <i className="material-icons">double_arrow</i>Save
          </OakButton>
          <OakButton
            action={() => props.setEditNote(true)}
            theme="default"
            variant="outline"
            align="center"
          >
            <i className="material-icons">refresh</i>Undo All
          </OakButton>
          <OakButton
            action={() => props.setEditNote(false)}
            theme="default"
            variant="outline"
            align="center"
          >
            <i className="material-icons">close</i>Cancel
          </OakButton>
          {!preview && (
            <OakButton
              action={() => setPreview(!preview)}
              theme="default"
              variant="outline"
              align="right"
            >
              <i className="material-icons">visibility</i>Show Preview
            </OakButton>
          )}
          {preview && (
            <OakButton
              action={setPreview(!preview)}
              theme="default"
              variant="outline"
              align="right"
            >
              <i className="material-icons">visibility_off</i>Hide Preview
            </OakButton>
          )}

          <div>
            <OakSelect
              label="Notebook"
              data={props.note}
              id="notebook"
              handleChange={e => props.handleChange(e)}
              elements={props.notebooks}
              firstAction="<create new>"
            />
          </div>
          <div>
            {props.note.notebook === '<create new>' && (
              <OakText
                label="Notebook name"
                data={props.note}
                id="newNotebook"
                handleChange={e => props.handleChange(e)}
              />
            )}
          </div>
          <OakText
            label="Title"
            data={props.note}
            id="title"
            handleChange={e => props.handleChange(e)}
          />
          <OakText
            label="Tags (separated by blank spaces)"
            data={props.note}
            id="tags"
            handleChange={e => props.handleChange(e)}
          />

          {preview && (
            <div className="edit-note-view">
              <div>
                <OakEditor
                  label="Content"
                  data={props.note}
                  id="content"
                  handleChange={e => props.handleChange(e)}
                />
              </div>
              <div>
                <div className="typography-5 space-bottom-1">Preview</div>
                <Showdown source={props.note.content} />
              </div>
            </div>
          )}
          {!preview && (
            <OakEditor
              label="Content"
              data={props.note}
              id="content"
              handleChange={e => props.handleChange(e)}
            />
          )}
          <div className="space-top-2" />
        </div>
      )}
    </>
  );
};

export default NoteItem;
