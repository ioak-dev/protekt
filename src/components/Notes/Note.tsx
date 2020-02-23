import React, { Component } from 'react';
import Showdown from '../../oakui/Showdown';
import OakSelect from '../../oakui/OakSelect';
import { receiveMessage } from '../../events/MessageService';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';

interface Props {
  note: any;
  id: string;
  deleteNote: Function;
  saveNote: Function;
  notebooks: any;
}

interface State {
  editNote: boolean;
  preview: boolean;

  newNotebook: string;

  id?: string;
  title: string;
  tags: string;
  content: any;
  notebook: string;
  flags: any;
  flag: string;
}

class Note extends Component<Props, State> {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      editNote: false,
      preview: true,
      newNotebook: '',
      title: '',
      content: '',
      tags: '',
      notebook: '',
      flag: '',

      flags: [
        {
          key: 'one',
          value: <div className="select-palette one" />
        },
        {
          key: 'two',
          value: <div className="select-palette two" />
        },
        {
          key: 'three',
          value: <div className="select-palette three" />
        },
        {
          key: 'four',
          value: <div className="select-palette four" />
        },
        {
          key: 'five',
          value: <div className="select-palette five" />
        },
        {
          key: 'six',
          value: <div className="select-palette six" />
        }
      ]
    };
  }

  componentDidMount() {
    this._isMounted = true;
    receiveMessage().subscribe(message => {
      if (this._isMounted) {
        if (message.name === 'closeNoteEditView' && message.signal) {
          this.hideEdit();
          this.setState({ newNotebook: '' });
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  delete = () => {
    this.props.deleteNote(this.props.id);
  };

  showEdit = () => {
    this.setState({
      editNote: true,
      title: this.props.note.title,
      content: this.props.note.content,
      tags: this.props.note.tags,
      notebook: this.props.note.notebook,
      flag: this.props.note.flag
    });
  };

  hideEdit = () => {
    this.setState({
      editNote: false
    });
  };

  save = () => {
    let notebook = this.state.notebook;

    if (notebook === '<create new>') {
      notebook = this.state.newNotebook;
    }

    this.props.saveNote(
      {
        id: this.props.id,
        title: this.state.title,
        content: this.state.content,
        tags: this.state.tags,
        flag: this.state.flag,
        notebook: notebook
      },
      true
    );
  };

  togglepreview = () => {
    this.setState({
      preview: !this.state.preview
    });
  };

  handleChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  render() {
    const tags: any = [];
    if (this.props.note.tags) {
      this.props.note.tags.split(' ').map(item => {
        tags.push(
          <div key={item} className="tag">
            {item}
          </div>
        );
      });
    }

    return (
      <>
        {!this.state.editNote && (
          <>
            <div className="notebook">
              <i className="material-icons">insert_drive_file</i>
              {this.props.note.notebook}
            </div>
            {/* <div className="space-bottom-2" /> */}
            <div className="typography-3 space-bottom-1">
              {this.props.note.title}
            </div>
            {tags}
            <div className="space-bottom-2" />
            <OakButton
              action={this.showEdit}
              theme="secondary"
              variant="animate in"
              align="left"
            >
              <i className="material-icons">edit</i>Edit
            </OakButton>
            <OakButton
              action={this.delete}
              theme="secondary"
              variant="animate in"
              align="right"
            >
              <i className="material-icons">delete</i>Delete
            </OakButton>

            <Showdown source={this.props.note.content} />
          </>
        )}

        {this.state.editNote && (
          <div>
            <div className="typography-3 space-bottom-1">
              {this.state.title}
            </div>

            <OakButton
              action={this.save}
              theme="primary"
              variant="animate in"
              align="left"
            >
              <i className="material-icons">double_arrow</i>Save
            </OakButton>
            <OakButton
              action={this.showEdit}
              theme="default"
              variant="outline"
              align="center"
            >
              <i className="material-icons">refresh</i>Undo All
            </OakButton>
            <OakButton
              action={this.hideEdit}
              theme="default"
              variant="outline"
              align="center"
            >
              <i className="material-icons">close</i>Cancel
            </OakButton>
            {!this.state.preview && (
              <OakButton
                action={this.togglepreview}
                theme="default"
                variant="outline"
                align="right"
              >
                <i className="material-icons">visibility</i>Show Preview
              </OakButton>
            )}
            {this.state.preview && (
              <OakButton
                action={this.togglepreview}
                theme="default"
                variant="outline"
                align="right"
              >
                <i className="material-icons">visibility_off</i>Hide Preview
              </OakButton>
            )}

            <div>
              <OakSelect
                width="width-25"
                label="Flag"
                data={this.state}
                id="flag"
                handleChange={e => this.handleChange(e)}
                objects={this.state.flags}
              />
            </div>
            <div>
              <OakSelect
                label="Notebook"
                data={this.state}
                id="notebook"
                handleChange={e => this.handleChange(e)}
                elements={this.props.notebooks}
                firstAction="<create new>"
              />
            </div>
            <div>
              {this.state.notebook === '<create new>' && (
                <OakText
                  label="Notebook name"
                  data={this.state}
                  id="newNotebook"
                  handleChange={e => this.handleChange(e)}
                />
              )}
            </div>
            <OakText
              label="Title"
              data={this.state}
              id="title"
              handleChange={e => this.handleChange(e)}
            />
            <OakText
              label="Tags (separated by blank spaces)"
              data={this.state}
              id="tags"
              handleChange={e => this.handleChange(e)}
            />

            {this.state.preview && (
              <div className="edit-note-view">
                <div>
                  <OakText
                    label="Content (Markdown / HTML / Plaintext)"
                    data={this.state}
                    id="content"
                    multiline
                    handleChange={e => this.handleChange(e)}
                  />
                </div>
                <div>
                  <div className="typography-5 space-bottom-1">Preview</div>
                  <Showdown source={this.state.content} />
                </div>
              </div>
            )}
            {!this.state.preview && (
              <OakText
                label="Content (Markdown / HTML / Plaintext)"
                data={this.state}
                id="content"
                multiline
                handleChange={e => this.handleChange(e)}
              />
            )}
            <div className="space-top-2" />
          </div>
        )}
      </>
    );
  }
}

export default Note;
