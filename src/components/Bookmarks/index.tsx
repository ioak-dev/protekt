import React, { Component } from 'react';
import Link from './Link';
import { constants } from '../Constants';
import OakDialog from '../Ux/OakDialog';
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';
import './style.scss';
import { Switch } from '@material-ui/core';
import { isEmptyOrSpaces, match } from '../Utils';
import Sidebar from '../Ux/Sidebar';
import { httpGet, httpPut, httpDelete } from '../Lib/RestTemplate';
import { sendMessage } from '../../events/MessageService';
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
    href: string,
    tags: string,
    editDialogLabel: string,
    isEditDialogOpen: boolean,
    firstLoad: boolean,

    searchPref: {
        title: boolean,
        tags: boolean,
        href: boolean,
        content: boolean
    },

    sidebarElements: any
}
class Bookmarks extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            view: [],
            isEditDialogOpen: false,

            searchtext: '',
            isFiltered: false,

            id: undefined,
            title: '',
            href: '',
            tags: '',
            editDialogLabel: 'Add',
            firstLoad: true,

            searchPref: {
                title: true,
                tags: true,
                href: true,
                content: true
            },

            sidebarElements: {
                addNew: [
                    {
                        label: 'New Bookmark',
                        action: this.toggleEditDialog,
                        icon: 'note_add'
                    }
                ]
            }
        }
    }
    componentDidMount() {
        if (this.props.location.search) {
            const query = queryString.parse(this.props.location.search);
            if (query && query.q) {
                if (query.q.startsWith('tags')) {
                    this.setState({
                        searchPref: {
                            title: false,
                            tags: true,
                            href: true,
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
            this.initializeBookmarks(this.props.authorization);
            this.setState({firstLoad: false})
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.firstLoad && nextProps.authorization) {
            this.initializeBookmarks(nextProps.authorization);
            this.setState({firstLoad: false})
        }
    }

    initializeBookmarks(authorization) {
        const that = this;
        httpGet(constants.API_URL_BOOKMARK,
            {
                headers: {
                    Authorization: 'Bearer ' + authorization.token
                }
            }, authorization.password)
            .then(function(response) {
                that.setState({items: response.data, view: response.data});
                if (that.state.isFiltered) {
                    that.search();
                }
            }
        );
    }

    toggleEditDialog = () => {
        this.setState({
            isEditDialogOpen: !this.state.isEditDialogOpen,
            id: undefined,
            title: '',
            href: '',
            tags: '',
            editDialogLabel: 'Add'
        })
    }

    editBookmark = (bookmark) => {
        this.setState({
            isEditDialogOpen: true,
            id: bookmark._id,
            title: bookmark.title,
            href: bookmark.href,
            tags: bookmark.tags,
            editDialogLabel: 'Save'
        })
    }

    deleteBookmark = (bookmarkId) => {
        const that = this;
        httpDelete(constants.API_URL_BOOKMARK + "/" + bookmarkId,
        {
            headers: {
                Authorization: 'Bearer ' + this.props.authorization.token
            }
        })
        .then(function(response) {
            if (response.status === 201) {
                sendMessage('notification', true, {type: 'success', message: 'Bookmark deleted', duration: 5000});
                that.initializeBookmarks(that.props.authorization);
            }
        })
        .catch((error) => {
            if (error.response.status === 401) {
                that.props.logout(null, 'failure', 'Session expired. Login again');
            }
        })
    }

    clearSearch = () => {
        this.setState({
            view: this.state.items,
            isFiltered: false,
            searchtext: ''
        })
        sendMessage('sidebar', false)
    }

    searchByTag = (tagName) => {
        
        this.setState({
            searchPref: {
                ...this.state.searchPref,
                title: false,
                tags: true,
                href: false
            },
            searchtext: tagName,
            isFiltered: true
        }, () => this.initializeBookmarks(this.props.authorization));
    }

    search = (event?: any) => {
        if (event) {
            event.preventDefault();
        }

        if (isEmptyOrSpaces(this.state.searchtext)) {
            this.setState({
                view: this.state.items,
                isFiltered: false
            });
            return;
        }

        this.setState({
            view: this.state.items.filter((item) => {
                if (this.state.searchPref.title && match(item.title, this.state.searchtext)) {
                    return true;
                } else if (this.state.searchPref.tags && match(item.tags, this.state.searchtext)) {
                    return true;
                } else if (this.state.searchPref.href && match(item.href, this.state.searchtext)) {
                    return true;
                }
            }),
            isFiltered: true
        });
        sendMessage('sidebar', false)
    }

    toggleSearchPref = (pref) => {
        this.setState({
            searchPref: {
                ...this.state.searchPref,
                [pref]: !this.state.searchPref[pref]
            }
        })
    }

    addBookmark= () => {
        const that = this;

        let bookmark = {
            id: this.state.id,
            title: this.state.title,
            href: this.state.href,
            tags: this.state.tags
        }

        if (isEmptyOrSpaces(bookmark.title)) {
            sendMessage('notification', true, {type: 'failure', message: 'Title / description missing', duration: 5000});
            return;
        }

        if (isEmptyOrSpaces(bookmark.href)) {
            sendMessage('notification', true, {type: 'failure', message: 'Website URL / Link is missing', duration: 5000});
            return;
        }

        if (isEmptyOrSpaces(bookmark.tags)) {
            bookmark.tags = 'unsorted';
        }

        httpPut(constants.API_URL_BOOKMARK, bookmark,
        {
            headers: {
                Authorization: 'Bearer ' + this.props.authorization.token
            }
        }, this.props.authorization.password)
        .then(function(response) {
            if (response.status === 201) {
                sendMessage('notification', true, {type: 'success', message: 'Bookmark created', duration: 5000});
                that.toggleEditDialog();

                that.initializeBookmarks(that.props.authorization);
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
                [event.currentTarget.name]: event.currentTarget.value
            }
        )
    }

    render() {
        const listview = this.state.view.map(item => (
            <div key={item._id}>
            <Link id={item._id} bookmark={item} editBookmark={this.editBookmark} deleteBookmark={this.deleteBookmark} searchByTag={this.searchByTag} />
            <br />
            </div>
        ))
        return (
            <div className="bookmarks">
                <OakDialog visible={this.state.isEditDialogOpen} toggleVisibility={this.toggleEditDialog}>
                    <div className="dialog-body">
                        <OakText label="Title" data={this.state} id="title" handleChange={e => this.handleChange(e)} />
                        <OakText label="URL" data={this.state} id="href" handleChange={e => this.handleChange(e)} />
                        <OakText label="Tags" data={this.state} id="tags" handleChange={e => this.handleChange(e)} />
                    </div>
                    <div className="dialog-footer">
                        <OakButton action={this.toggleEditDialog} theme="default" variant="outline" align="left"><i className="material-icons">close</i>Cancel</OakButton>
                        <OakButton action={this.addBookmark} theme="primary" variant="animate in" align="right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</OakButton>
                    </div>
                </OakDialog>

                <ViewResolver>
                    <View main>
                        {listview}
                    </View>
                    <View side>
                        <div className="filter-container">
                            <div className="section-main">
                                <Sidebar label="Add New" elements={this.state.sidebarElements['addNew']} icon="add" animate />
                                <Sidebar label="Search" elements={this.state.sidebarElements['search']} icon="search" animate number={this.state.isFiltered ? this.state.view.length : undefined}>
                                    <form method="GET" onSubmit={this.search} noValidate>
                                    <div className="space-top-2 space-left-4 space-right-4"><OakText label="Keywords" id="searchtext" data={this.state} handleChange={e => this.handleChange(e)} /></div>
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
                                            checked={this.state.searchPref.href}
                                            onChange={() => this.toggleSearchPref('href')}
                                            inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                        Include URL
                                    </div>
                                    {this.state.isFiltered && <div className="typography-4 space-top-2 space-left-2">Found {this.state.view.length} bookmarks matching the search criteria</div>}
                                    <div className="actionbar-2 space-top-2 space-bottom-2">
                                        <div>
                                            <OakButton action={this.clearSearch} theme="default">Clear</OakButton>
                                        </div>
                                        <div>
                                        <OakButton action={this.search} theme="primary" variant="animate in">Search</OakButton>
                                        </div>
                                    </div>

                                </Sidebar>
                            </div>
                        </div>
                    </View>
                </ViewResolver>
            </div>
        )
    }
}

export default Bookmarks;
