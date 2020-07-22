import React, { useState, useEffect } from 'react';
import { Switch } from '@material-ui/core';
import NoteItem from './NoteItem';
import OakDialog from '../../oakui/OakDialog';
import OakViewResolver from '../../oakui/OakViewResolver';
import OakView from '../../oakui/OakView';
import './style.scss';
import OakSidebar from '../../oakui/OakSidebar';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import OakSelect from '../../oakui/OakSelect';
import NoteLink from './NoteLink';
import OakEditor from '../../oakui/OakEditor';

const sortTypes = [
  { key: 'createdAt', value: 'created' },
  { key: 'lastModifiedAt', value: 'last modified' },
  { key: 'notebook', value: 'notebook' },
  { key: 'title', value: 'note name' },
];

const sortOrders = ['ascending', 'descending'];

interface Props {
  selectNote: Function;
  saveNote: Function;
  deleteNote: Function;
  search: any;

  note: any;
  searchPref: any;
  filterPref: any;
  view: any[];
  searchResults: any[];

  notebooks: any;

  handleNoteDataChange: Function;
  handleSearchPrefDataChange: Function;
  handleFilterPrefDataChange: Function;
  toggleSearchPref: Function;
  clearSearch: Function;
}
const emptyNote = {
  id: undefined,
  type: 'Notebook',
  title: '',
  content: '',
  tags: '',
  notebook: '',
  newNotebook: '',
};

const NoteView = (props: Props) => {
  const [editDialog, setEditDialog] = useState(false);
  const [editNote, setEditNote] = useState(false);

  const domain = 'note';
  const sidebarElements = {
    addNew: [
      {
        label: 'New Note',
        action: () => newNote(),
        icon: 'note_add',
      },
      {
        label: 'New Whiteboard',
        action: () => newNote(),
        icon: 'tv',
      },
    ],
  };

  useEffect(() => {
    const eventBus = receiveMessage().subscribe(message => {
      if (message.name === domain && message.signal) {
        sendMessage('notification', true, {
          type: 'success',
          message: `${domain} ${message.data.action}`,
          duration: 5000,
        });
        if (message.data.action === 'created') {
          toggleEditDialog();
        } else if (message.data.action === 'updated') {
          setEditNote(false);
        }
      }
    });
    return () => eventBus.unsubscribe();
  });

  // useEffect(() => {
  //     if (!editNote) {
  //         selectNote(emptyNote);
  //     }
  // }, [editNote])

  function newNote() {
    props.selectNote(emptyNote);
    setEditDialog(true);
  }

  function selectNote(item) {
    props.selectNote(item);
    sendMessage('sidebar', false);
  }

  function toggleEditDialog() {
    setEditDialog(!editDialog);
  }

  return (
    <div className="notes">
      <OakDialog visible={editDialog} toggleVisibility={toggleEditDialog}>
        <div className="dialog-body">
          <div>
            <OakSelect
              label="Notebook"
              theme="default"
              data={props.note}
              id="notebook"
              handleChange={e => props.handleNoteDataChange(e)}
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
                handleChange={e => props.handleNoteDataChange(e)}
              />
            )}
          </div>
          <div>
            <OakText
              label="Title"
              data={props.note}
              id="title"
              handleChange={e => props.handleNoteDataChange(e)}
            />
          </div>
          <div>
            <OakText
              label="Tags (separated by blank spaces)"
              data={props.note}
              id="tags"
              handleChange={e => props.handleNoteDataChange(e)}
            />
          </div>
          <div>
            <OakEditor
              label="Content"
              data={props.note}
              id="content"
              handleChange={e => props.handleNoteDataChange(e)}
            />
          </div>
        </div>
        <div className="dialog-footer">
          <OakButton
            action={toggleEditDialog}
            theme="default"
            variant="outline"
            align="left"
          >
            <i className="material-icons">close</i>Cancel
          </OakButton>
          <OakButton
            action={props.saveNote}
            theme="primary"
            variant="appear"
            align="right"
          >
            <i className="material-icons">double_arrow</i>Save
          </OakButton>
        </div>
      </OakDialog>

      <OakViewResolver>
        <OakView main>
          {(props.note?._id || props.note?.id) && (
            <NoteItem
              note={props.note}
              saveNote={props.saveNote}
              editNote={editNote}
              setEditNote={setEditNote}
              deleteNote={props.deleteNote}
              notebooks={props.notebooks}
              handleChange={e => props.handleNoteDataChange(e)}
            />
          )}
        </OakView>
        <OakView side>
          <div className="filter-container">
            <div className="section-main">
              <OakSidebar
                label="Add New"
                elements={sidebarElements.addNew}
                icon="add"
                animate
              />
              <OakSidebar
                label="Search"
                icon="search"
                animate
                number={
                  props.searchPref.filtered
                    ? props.searchResults.length
                    : undefined
                }
              >
                <div className="space-top-1" />
                <form method="GET" onSubmit={props.search} noValidate>
                  <div className="space-left-4 space-right-4">
                    <OakText
                      label="Keywords"
                      id="searchText"
                      data={props.searchPref}
                      handleChange={e => props.handleSearchPrefDataChange(e)}
                    />
                  </div>
                </form>
                <div className="typography-5 space-top-2 space-left-4">
                  <Switch
                    checked={props.searchPref.title}
                    onChange={() => props.toggleSearchPref('title')}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  Include title
                </div>
                <div className="typography-5 space-top-2 space-left-4">
                  <Switch
                    checked={props.searchPref.tags}
                    onChange={() => props.toggleSearchPref('tags')}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  Include tags
                </div>
                <div className="typography-5 space-top-2 space-left-4">
                  <Switch
                    checked={props.searchPref.content}
                    onChange={() => props.toggleSearchPref('content')}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  Include Content
                </div>
                {props.searchPref.filtered && (
                  <div className="typography-4 space-top-2">
                    Found {props.searchResults.length} notes matching the search
                    criteria
                  </div>
                )}
                <div className="actionbar-2 space-top-2 space-bottom-2">
                  <div>
                    <OakButton
                      action={props.clearSearch}
                      theme="default"
                      variant="regular"
                    >
                      Clear
                    </OakButton>
                  </div>
                  <div>
                    <OakButton
                      action={props.search}
                      theme="default"
                      variant="appear"
                    >
                      Search
                    </OakButton>
                  </div>
                </div>
              </OakSidebar>

              <OakSidebar
                label={
                  props.searchPref.filtered ? 'Search results' : 'All Notes'
                }
                icon="notes"
                number={props.view.length}
              >
                <div className="filter-bar">
                  {props.searchResults.length > 1 && (
                    <div>
                      <OakSelect
                        label="Notebook"
                        data={props.filterPref}
                        id="notebookFilter"
                        handleChange={e => props.handleFilterPrefDataChange(e)}
                        elements={props.filterPref.notebookList}
                        first="all notebooks"
                      />
                    </div>
                  )}
                  {props.searchResults.length === 1 && (
                    <div>
                      <OakSelect
                        label="Notebook"
                        data={props.filterPref}
                        id="notebookFilter"
                        handleChange={e => props.handleFilterPrefDataChange(e)}
                        elements={props.filterPref.notebookList}
                      />
                    </div>
                  )}
                  <div />
                  <div>
                    <OakSelect
                      label="Sort by"
                      data={props.filterPref}
                      id="sortBy"
                      handleChange={e => props.handleFilterPrefDataChange(e)}
                      objects={sortTypes}
                    />
                  </div>
                  <div>
                    <OakSelect
                      label="Sort Order"
                      data={props.filterPref}
                      id="sortOrder"
                      handleChange={e => props.handleFilterPrefDataChange(e)}
                      elements={sortOrders}
                    />
                  </div>
                </div>
                {props.view?.map((item: any) => (
                  <div key={item._id ? item._id : item.id}>
                    {/* <NoteLink selected={props.note?.id === item._id ? true : false} id={item._id} note={item} selectNote={() => selectNote(item)} showTag={notebookFilter === 'all notebooks'}/> */}
                    <NoteLink
                      selected={
                        !!(
                          props.note?._id === item._id ||
                          props.note?.id === item._id
                        )
                      }
                      id={item._id}
                      note={item}
                      selectNote={() => selectNote(item)}
                      showTag
                    />
                  </div>
                ))}
              </OakSidebar>
            </div>
          </div>
        </OakView>
      </OakViewResolver>
    </div>
  );
};

export default NoteView;
