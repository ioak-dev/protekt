import React, { Component } from 'react';
import { receiveMessage } from '../../events/MessageService';
import ArcTextField from '../Ux/ArcTextField';
import ArcSelect from '../Ux/ArcSelect';
import Canvas from '../Canvas';

interface Props {
    note: any,
    id: string,
    deleteNote: Function,
    saveNote: Function,
    notebooks: any
}

interface State {
    editNote: boolean,
    preview: boolean,

    newNotebook: string,

    id?: string,
    title: string,
    tags: string,
    attributes: any,
    content: any,
    notebook: string,
    flags: any,
    flag: string
}

class Artboard extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            editNote: false,
            preview: true,
            newNotebook: '',
            title: this.props.note.title,
            attributes: this.props.note.attributes ? this.props.note.attributes : {},
            content: this.props.note.content,
            tags: this.props.note.tags,
            notebook: this.props.note.notebook,
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
        }
    }

    componentWillMount() {
        receiveMessage().subscribe(
            message => {
                if (message.name === 'closeNoteEditView' && message.signal) {
                    this.hideEdit();
                    this.setState({newNotebook: ''});
                }
            }
        );
    }

    delete = () => {
        this.props.deleteNote(this.props.id);
    }

    showEdit = () => {
        this.setState({
            editNote: true
        })
    }

    hideEdit = () => {
        this.setState({
            editNote: false
        })
    }

    save = () => {
        let notebook = this.state.notebook;

        if (notebook === '<create new>') {
            notebook = this.state.newNotebook;
        }

        this.props.saveNote({
            id: this.props.id,
            title: this.state.title,
            attributes: this.state.attributes,
            content: this.state.content,
            tags: this.state.tags,
            flag: this.state.flag,
            notebook: notebook
        }, true)
    }

    togglepreview = () => {
        this.setState({
            preview: !this.state.preview
        })
    }

    handleChange = (event) => {
        this.setState(
            {
                ...this.state,
                [event.target.name]: event.target.value
            }
        )
    }

    attributeChange = (event) => {
        this.setState(
            {
                attributes: {
                    ...this.state.attributes,
                    [event.target.name]: event.target.value
                }
            }
        )
    }

    contentChange = (attributes, content) => {
        this.setState({
            attributes: attributes,
            content: content
        })
    }

    render() {
        const tags:any = [];
        if (this.props.note.tags) {
            this.props.note.tags.split(" ").map(item => {
                tags.push(<div key={item} className="tag">{item}</div>);
            })
        }

        return (
            <div className="artboard">
                {!this.state.editNote && 
                <>
                    <div className="notebook"><i className="material-icons">insert_drive_file</i>{this.props.note.notebook}</div>
                    {/* <div className="space-bottom-2" /> */}
                    <div className="typography-3 space-bottom-1">
                        {this.props.note.title}
                    </div>
                    {tags}
                    <div className="space-bottom-2" />
                    <button onClick={this.showEdit} className="secondary animate left"><i className="material-icons">edit</i>Edit</button>
                    <button onClick={this.delete} className="secondary animate right"><i className="material-icons">delete</i>Delete</button>
                    <div className="space-top-2" />
                    <Canvas attributes={this.state.attributes} data={this.state.content} handleChange={this.contentChange} />
                </>}
            
                {this.state.editNote && 
                <div className="canvas-edit">
                    <div className="typography-3 space-bottom-1">{this.state.title}</div>
                    
                    <button onClick={this.save} className="primary animate left space-bottom-2"><i className="material-icons">double_arrow</i>Save</button>
                    <button onClick={this.showEdit} className="default disabled center"><i className="material-icons">refresh</i>Undo All</button>
                    <button onClick={this.hideEdit} className="default disabled center"><i className="material-icons">close</i>Cancel</button>

                    <div><ArcSelect label="Flag" data={this.state} id="flag" handleChange={e => this.handleChange(e)} objects={this.state.flags} /></div>
                    <div><ArcSelect label="Notebook" data={this.state} id="notebook" handleChange={e => this.handleChange(e)} elements={this.props.notebooks} firstAction="<create new>" /></div>
                    <div>
                        {this.state.notebook === '<create new>' && <ArcTextField label="Notebook name" data={this.state} id="newNotebook" handleChange={e => this.handleChange(e)} />}
                    </div>
                    <ArcTextField label="Title" data={this.state} id="title" handleChange={e => this.handleChange(e)} />
                    <ArcTextField label="Tags (separated by blank spaces)" data={this.state} id="tags" handleChange={e => this.handleChange(e)} />
                    
                    {/* <ArcTextField label="Height" data={this.state.attributes} id="height" handleChange={e => this.attributeChange(e)} />
                    <ArcTextField label="Width" data={this.state.attributes} id="width" handleChange={e => this.attributeChange(e)} /> */}
                    <ArcTextField label="Background color" data={this.state.attributes} id="backgroundColor" handleChange={e => this.attributeChange(e)} />
                    <Canvas attributes={this.state.attributes} data={this.state.content} handleChange={this.contentChange} edit={true} />
                </div>}
            </div>
        )
    }
}

export default Artboard;
