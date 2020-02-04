import React, { Component } from 'react';
import Note from './Note';
import { Switch } from '@material-ui/core';
import { constants } from '../Constants';
import { httpGet, httpPut, httpDelete } from "../Lib/RestTemplate";
import OakDialog from '../Ux/OakDialog';
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';
import './style.scss';
import NoteRef from './NoteRef';
import { isEmptyOrSpaces, match, sort } from '../Utils';
import OakSelect from '../Ux/OakSelect';
import Sidebar from '../Ux/Sidebar';

import { sendMessage, receiveMessage } from '../../events/MessageService';
import { Authorization } from '../Types/GeneralTypes';
import OakText from '../Ux/OakText';
import OakButton from '../Ux/OakButton';

const queryString = require('query-string');

interface Props {
    authorization: Authorization
    location: any,
    logout: Function
}

interface State {
    items: any,
    view: any,

    searchtext: string,
    isFiltered: boolean,

    id?: string,
    title: string,
    tags: string,
    isAddDialogOpen: boolean,
    firstLoad: boolean,
    selectedNoteId?: string,
    content: string,
    newNotebook: string,
    existingNotebook: string,
    existingNotebookList: any,
    filteredNotebookList: any,
    notebookFilter: string,
    showFilter: boolean,
    sortBy: string,
    sortOrder: string,
    flag: string,

    searchPref: {
        title: boolean,
        tags: boolean,
        content: boolean
    },
    searchResults: any,

    sidebarElements: any
}

class Notes extends Component<Props, State> {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            searchResults: [],
            view: [],
            isAddDialogOpen: false,

            selectedNoteId: '',

            title: '',
            content: '',
            tags: '',
            newNotebook: '',
            existingNotebook: '',
            existingNotebookList: [],
            filteredNotebookList: [],
            notebookFilter: 'all notebooks',
            sortBy: 'last modified',
            sortOrder: 'descending',
            firstLoad: true,
            flag: '',

            showFilter: false,
            searchtext: '',
            isFiltered: false,
            searchPref: {
                title: true,
                tags: true,
                content: true
            },

            sidebarElements: {
                addNew: [
                    {
                        label: 'New Note',
                        action: this.newNote,
                        icon: 'note_add'
                    }
                ]
            }
        }
    }

    sortTypes =
        {'created': 'createdAt',
        'last modified': 'lastModifiedAt',
        'notebook': 'notebook',
        'note name': 'title'}

    sortOrders = [
        'ascending',
        'descending'
    ];

    componentDidMount() {
        this._isMounted = true;
        if (this.props.location.search) {
            const query = queryString.parse(this.props.location.search);
            if (query && query.q) {
                if (query.q.startsWith('tags')) {
                    this.setState({
                        searchPref: {
                            title: false,
                            tags: true,
                            content: false
                        }
                    })
                }
                this.setState({
                    searchtext: query.q,
                    isFiltered: true
                })
            }
        }

        if(this.state.firstLoad && this.props.authorization.isAuth) {
            this.initializeNotes(this.props.authorization);
            this.setState({firstLoad: false})
        }

        receiveMessage().subscribe(message => {
            if (this._isMounted) {
                if (message.name === 'noteListRefreshed') {
                    this.applyFilter();
                }
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.firstLoad && nextProps.authorization) {
            this.initializeNotes(nextProps.authorization);
            this.setState({firstLoad: false})
        }
    }

    initializeNotes(authorization: Authorization, selectedNoteId?: string) {
        const that = this;
        httpGet(constants.API_URL_NOTE,
            {
                headers: {
                    Authorization: 'Bearer ' + authorization.token
                }
            }, authorization.password)
            .then(function(response) {
                that.setState({items: response.data, searchResults: response.data, view: response.data});
                if (that.state.isFiltered) {
                    that.search();
                } else {
                    sendMessage('noteListRefreshed', true);
                }

                const existingNotebookList: any = [];
                response.data.map(item => existingNotebookList.push(item.notebook))

                that.setState({
                    existingNotebookList: [...new Set(existingNotebookList)]
                });

                if (selectedNoteId) {
                    that.setState({selectedNoteId: selectedNoteId});
                } else if (!that.state.selectedNoteId && response.data && response.data.length > 0) {
                    that.setState({selectedNoteId: response.data[0]._id});
                }
            }
        );
    }

    newNote = () => {
        this.toggleAddDialog();
        sendMessage('sidebar', false);
    }

    toggleAddDialog = () => {
        this.setState({
            isAddDialogOpen: !this.state.isAddDialogOpen,
        });
        this.resetForm();
    }

    resetForm = () => {
        this.setState({
            id: undefined,
            title: '',
            content: '',
            tags: '',
            existingNotebook: '',
            newNotebook: ''
        })
    }

    closeAllDialog = () => {
        this.setState({
            isAddDialogOpen: false,
        });
        this.resetForm();
    }

    toggleFilter = () => {
        this.setState({showFilter: !this.state.showFilter});
    }

    clearSearch = () => {
        this.setState({
            searchResults: this.state.items,
            isFiltered: false,
            searchtext: ''
        }, () => sendMessage('noteListRefreshed', true))
        sendMessage('sidebar', false);
    }

    search = (event?: any) => {
        if (event) {
            event.preventDefault();
        }

        if (isEmptyOrSpaces(this.state.searchtext)) {
            this.setState({
                searchResults: this.state.items,
                isFiltered: false
            }, () => sendMessage('noteListRefreshed', true));
            return;
        }

        const searchResults = this.state.items.filter((item) => {
            if (this.state.searchPref.title && match(item.title, this.state.searchtext)) {
                return true;
            } else if (this.state.searchPref.tags && match(item.tags, this.state.searchtext)) {
                return true;
            } else if (this.state.searchPref.content && match(item.content, this.state.searchtext)) {
                return true;
            }
        });
        let selectedNoteId = undefined;
        if (searchResults.length > 0) {
            selectedNoteId = searchResults[0]._id;
        }

        let notebookFilter = "all notebooks";
        let notebookList: any = [];
        searchResults.map(item => {
            notebookList.push(item.notebook);
        });

        if ([...new Set(notebookList)].length === 1) {
            notebookFilter = notebookList[0];
        }
        this.setState({
            searchResults: searchResults,
            isFiltered: true,
            selectedNoteId: selectedNoteId,
            notebookFilter: notebookFilter
        }, () => sendMessage('noteListRefreshed', true));
        sendMessage('sidebar', false)
    }

    applyFilter = () => {
        const notebookList: any = [];
        let noteList: any = [];
        this.state.searchResults.map(item => {
            if (isEmptyOrSpaces(this.state.notebookFilter) || this.state.notebookFilter === 'all notebooks' || item.notebook === this.state.notebookFilter) {
                noteList.push(item);
            }
            notebookList.push(item.notebook);
        });

        noteList = sort(noteList, this.sortTypes[this.state.sortBy], this.state.sortOrder === 'descending' ? true : false);

        let selectedNoteId = '';
        if (noteList && noteList.length > 0) {
            selectedNoteId = noteList[0]._id;
        }

        this.setState({
            selectedNoteId: selectedNoteId,
            view: noteList,
            filteredNotebookList: [...new Set(notebookList)]
        });
    }

    toggleSearchPref = (pref) => {
        this.setState({
            searchPref: {
                ...this.state.searchPref,
                [pref]: !this.state.searchPref[pref]
            }
        })
    }

    deleteNote = (noteId) => {
        const that = this;
        httpDelete(constants.API_URL_NOTE + "/" + noteId,
        {
            headers: {
                Authorization: 'Bearer ' + this.props.authorization.token
            }
        })
        .then(function(response) {
            if (response.status === 201) {
                sendMessage('notification', true, {type: 'success', message: 'Note deleted', duration: 5000});
                that.setState({
                    selectedNoteId: undefined
                }, () => that.initializeNotes(that.props.authorization));

            }
        })
        .catch((error) => {
            if (error.response.status === 401) {
                that.props.logout(null, 'failure', 'Session expired. Login again');
            }
        })
    }

    selectNote = (noteId) => {
        this.setState({
            selectedNoteId: noteId
        })
        sendMessage('sidebar', false);
    }

    saveNoteEvent = () => {
        let notebook = this.state.existingNotebook;
        if (notebook === '<create new>') {
            notebook = this.state.newNotebook;
        }
        this.saveNote({
            id: null,
            type: 'Note',
            title: this.state.title,
            content: this.state.content,
            tags: this.state.tags,
            flag: this.state.flag,
            notebook: notebook
        });
    }

    saveNote = (note, edit=false) => {

        const that = this;

        if (!note) {
            sendMessage('notification', true, {type: 'failure', message: 'Unknown error', duration: 5000});
            return;
        }

        if (isEmptyOrSpaces(note.notebook)) {
            sendMessage('notification', true, {type: 'failure', message: 'Notebook not chosen', duration: 5000});
            return;
        }

        if (isEmptyOrSpaces(note.title)) {
            sendMessage('notification', true, {type: 'failure', message: 'Note name / title missing', duration: 5000});
            return;
        }

        if (isEmptyOrSpaces(note.tags)) {
            note.tags = 'unsorted';
        }

        httpPut(constants.API_URL_NOTE, {
            id: note.id,
            type: note.type,
            title: note.title,
            attributes: note.attributes,
            content: note.content,
            tags: note.tags,
            flag: note.flag,
            notebook: note.notebook
        },
        {
            headers: {
                Authorization: 'Bearer ' + this.props.authorization.token
            }
        }, this.props.authorization.password, ['attributes'])
        .then(function(response) {
            if (response.status === 201) {
                if (edit) {
                    sendMessage('notification', true, {type: 'success', message: 'Note edited', duration: 5000});
                    sendMessage('closeNoteEditView', true);
                } else {
                    sendMessage('notification', true, {type: 'success', message: 'Note created', duration: 5000});
                    that.closeAllDialog();
                }

                that.initializeNotes(that.props.authorization, response.data._id);
            }
        })
        .catch((error) => {
            if (error.response.status === 401) {
                that.props.logout(null, 'failure', 'Session expired. Login again');
            }
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

    handleNotebookFilterChange = (event) => {
        this.setState(
        {
            ...this.state,
            [event.target.name]: event.target.value
        },
        () => this.applyFilter());
    }

    render() {
        const noteview = this.state.view.map(item => (
            <div key={item._id}>
                {item._id === this.state.selectedNoteId &&
                        <Note key={item._id} id={item._id} note={item} saveNote={this.saveNote} deleteNote={this.deleteNote} notebooks={this.state.existingNotebookList}/>}
            </div>
        ))
        const listNoteRef = this.state.view.map(item => (
            <div key={item._id}>
                <NoteRef selected={this.state.selectedNoteId === item._id ? true : false} id={item._id} note={item} selectNote={this.selectNote} showTag={this.state.notebookFilter === 'all notebooks'}/>
            </div>
        ))
        return (
            <div className="notes">
                <OakDialog visible={this.state.isAddDialogOpen} toggleVisibility={this.toggleAddDialog}>
                    <div className="dialog-body">
                        <div><OakSelect label="Notebook" data={this.state} id="existingNotebook" handleChange={e => this.handleChange(e)} elements={this.state.existingNotebookList} firstAction="<create new>" /></div>
                        <div>
                            {this.state.existingNotebook === '<create new>' && <OakText label="Notebook name" data={this.state} id="newNotebook" handleChange={e => this.handleChange(e)} />}
                        </div>
                        <div><OakText label="Title" data={this.state} id="title" handleChange={e => this.handleChange(e)} /></div>
                        <div><OakText label="Tags (separated by blank spaces)" data={this.state} id="tags" handleChange={e => this.handleChange(e)} /></div>
                        <div><OakText label="Content (Markdown / HTML / Plaintext)" data={this.state} id="content" multiline handleChange={e => this.handleChange(e)} /></div>
                    </div>
                    <div className="dialog-footer">
                        <OakButton action={this.toggleAddDialog} theme="default" variant="outline"><i className="material-icons">close</i>Cancel</OakButton>
                        <OakButton action={this.saveNoteEvent} theme="primary" variant="animate in"><i className="material-icons">double_arrow</i>Save</OakButton>
                    </div>
                </OakDialog>

                <ViewResolver sideLabel='More options'>
                    <View main>
                        {noteview}
                    </View>
                    <View side>
                        <div className="filter-container">
                            <div className="section-main">
                                <Sidebar label="Add New" elements={this.state.sidebarElements['addNew']} icon="add" animate />
                                <Sidebar label="Search" elements={this.state.sidebarElements['search']} icon="search" animate number={this.state.isFiltered ? this.state.searchResults.length : undefined}>
                                    <div className="space-top-1" />
                                    <form method="GET" onSubmit={this.search} noValidate>
                                        <div className="space-left-4 space-right-4"><OakText label="Keywords" id="searchtext" data={this.state} handleChange={e => this.handleChange(e)} /></div>
                                    </form>
                                    <div className="typography-5 space-top-2 space-left-4">
                                        <Switch
                                            checked={this.state.searchPref.title}
                                            onChange={() => this.toggleSearchPref('title')}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                        Include title
                                    </div>
                                    <div className="typography-5 space-top-2 space-left-4">
                                        <Switch
                                            checked={this.state.searchPref.tags}
                                            onChange={() => this.toggleSearchPref('tags')}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                        Include tags
                                    </div>
                                    <div className="typography-5 space-top-2 space-left-4">
                                        <Switch
                                            checked={this.state.searchPref.content}
                                            onChange={() => this.toggleSearchPref('content')}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                        Include Content
                                    </div>
                                    {this.state.isFiltered && <div className="typography-4 space-top-2">Found {this.state.searchResults.length} notes matching the search criteria</div>}
                                    <div className="actionbar-2 space-top-2 space-bottom-2">
                                        <div>
                                            <OakButton action={this.clearSearch} theme="default" variant="animate none">Clear</OakButton>
                                        </div>
                                        <div>
                                            <OakButton action={this.search} theme="default" variant="animate in">Search</OakButton>
                                        </div>
                                    </div>
                                </Sidebar>

                                <Sidebar label={this.state.isFiltered ? "Search results" : "All Notes"} icon="notes" number={this.state.view.length}>
                                    <div className="filter-bar">
                                        {this.state.filteredNotebookList.length > 1 && <div><OakSelect label="Notebook" data={this.state} id="notebookFilter" handleChange={e => this.handleNotebookFilterChange(e)} elements={this.state.filteredNotebookList} first='all notebooks' /></div>}
                                        {this.state.filteredNotebookList.length === 1 && <div><OakSelect label="Notebook" data={this.state} id="notebookFilter" handleChange={e => this.handleNotebookFilterChange(e)} elements={this.state.filteredNotebookList} /></div>}
                                        <div></div>
                                        <div><OakSelect label="Sort by" data={this.state} id="sortBy" handleChange={e => this.handleNotebookFilterChange(e)} elements={Object.keys(this.sortTypes)} /></div>
                                        <div><OakSelect label="Sort Order" data={this.state} id="sortOrder" handleChange={e => this.handleNotebookFilterChange(e)} elements={this.sortOrders} /></div>
                                    </div>
                                    {listNoteRef}
                                </Sidebar>
                            </div>
                        </div>
                    </View>
                </ViewResolver>
            </div>
        )
    }
}

export default Notes;
