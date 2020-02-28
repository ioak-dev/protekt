import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import { sendMessage } from '../../events/MessageService';
import { Authorization } from '../Types/GeneralTypes';
import { fetchNote, saveNote, deleteNote } from '../../actions/NoteActions';
import NoteView from './NoteView';
import { isEmptyOrSpaces, match, sort } from '../Utils';

const queryString = require('query-string');

interface Props {
  authorization: Authorization;
  location: any;
  logout: Function;

  fetchNote: Function;
  saveNote: Function;
  deleteNote: Function;
  note: any;
}

const NoteController = (props: Props) => {
  const emptyNote = {
    _id: undefined,
    id: undefined,
    type: 'Notebook',
    title: '',
    content: '',
    tags: '',
    notebook: '',
    newNotebook: '',
  };
  const [note, setNote] = useState(emptyNote);

  const [searchPref, setSearchPref] = useState({
    title: true,
    tags: true,
    content: true,
    searchText: '',
    filtered: false,
    filterActivator: false,
  });

  const [filterPref, setFilterPref] = useState({
    notebookFilter: 'all notebooks',
    notebookList: [...new Set()],
    sortBy: 'lastModifiedAt',
    sortOrder: 'descending',
    filtered: false,
    filterActivator: false,
  });

  const [firstLoad, setFirstLoad] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [view, setView] = useState([]);
  const [existingNotebookList, setExistingNotebookList] = useState([]);

  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      if (query && query.q) {
        if (query.q.startsWith('tags')) {
          setSearchPref({
            ...searchPref,
            title: false,
            tags: true,
            content: false,
          });
        }
        setSearchPref({
          ...searchPref,
          searchText: query.q,
          filterActivator: !searchPref.filterActivator,
        });
      }
    }
  }, [props.location.search]);

  useEffect(() => {
    if (firstLoad && props.authorization?.isAuth) {
      props.fetchNote(props.authorization);
      setFirstLoad(false);
    }
  }, [props.authorization]);

  useEffect(() => {
    setSearchPref({
      ...searchPref,
      filterActivator: !searchPref.filterActivator,
    });

    const existingNotebookListTemp: any = [];
    props.note?.items?.map(item =>
      existingNotebookListTemp.push(item.notebook)
    );
    setExistingNotebookList(Array.from(new Set(existingNotebookListTemp)));
  }, [props.note]);

  useEffect(() => {
    search();
  }, [searchPref.filterActivator]);

  useEffect(() => {
    filter();
  }, [filterPref.filterActivator]);

  const selectNote = (selectedNote: any) => {
    setNote(selectedNote);
  };

  const deleteNote = (bookmarkId: string) => {
    props.deleteNote(props.authorization, bookmarkId);
  };

  const clearSearch = () => {
    setView(props.note?.items);
    setFirstLoad(false);
    setSearchPref({
      ...searchPref,
      searchText: '',
      filterActivator: !searchPref.filterActivator,
    });
    sendMessage('sidebar', false);
  };

  const search = (event?: any) => {
    if (event) {
      event.preventDefault();
    }
    if (isEmptyOrSpaces(searchPref.searchText)) {
      setSearchResults(props.note?.items);
      setSearchPref({ ...searchPref, filtered: false });
      setFilterPref({
        ...filterPref,
        filterActivator: !filterPref.filterActivator,
      });
      return;
    }

    setSearchResults(
      props.note?.items?.filter(item => {
        if (searchPref.title && match(item.title, searchPref.searchText)) {
          return true;
        }
        if (searchPref.tags && match(item.tags, searchPref.searchText)) {
          return true;
        }
      })
    );
    setSearchPref({ ...searchPref, filtered: true });
    setFilterPref({
      ...filterPref,
      filterActivator: !filterPref.filterActivator,
    });
    sendMessage('sidebar', false);
  };

  const filter = () => {
    const notebookList: any = [];
    let noteList: any = [];
    searchResults.map((item: any) => {
      if (
        isEmptyOrSpaces(filterPref.notebookFilter) ||
        filterPref.notebookFilter === 'all notebooks' ||
        item.notebook === filterPref.notebookFilter
      ) {
        noteList.push(item);
      }
      notebookList.push(item.notebook);
    });

    noteList = sort(
      noteList,
      filterPref.sortBy,
      filterPref.sortOrder === 'descending'
    );

    if (noteList.length > 0) {
      let activeSelection = false;
      noteList.map((item: any) => {
        if (item._id === note.id || item._id === note._id) {
          activeSelection = true;
        }
      });

      if (!activeSelection) {
        setNote(searchResults[0]);
      }
    }

    // if (!notebookList.find(item => item === filterPref.notebookFilter)) {
    //     setFilterPref({
    //         ...filterPref, notebookFilter: (notebookList.length === 1 ? notebookList[0] : "all notebooks"), notebookList: Array.from(new Set(notebookList)), filtered: true
    //     });
    // } else {
    setFilterPref({
      ...filterPref,
      notebookList: Array.from(new Set(notebookList)),
      filtered: true,
    });
    // }

    setView(noteList);
  };

  const toggleSearchPref = pref => {
    setSearchPref({
      ...searchPref,
      [pref]: !searchPref[pref],
    });
  };

  const saveNote = () => {
    if (!note) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Unknown error',
        duration: 5000,
      });
      return;
    }

    if (
      isEmptyOrSpaces(note.notebook) ||
      (note.notebook === '<create new>' && isEmptyOrSpaces(note.newNotebook))
    ) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Notebook not chosen',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(note.title)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Note name / title missing',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(note.tags)) {
      note.tags = 'unsorted';
    }

    if (note.notebook === '<create new>') {
      note.notebook = note.newNotebook;
    }

    props.saveNote(props.authorization, note);
  };

  const handleNoteDataChange = event => {
    setNote({ ...note, [event.currentTarget.name]: event.currentTarget.value });
  };

  const handleSearchPrefDataChange = event => {
    setSearchPref({
      ...searchPref,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleFilterPrefDataChange = event => {
    setFilterPref({
      ...filterPref,
      [event.currentTarget.name]: event.currentTarget.value,
      filterActivator: !filterPref.filterActivator,
    });
  };

  return (
    <NoteView
      view={view}
      notebooks={existingNotebookList}
      searchResults={searchResults}
      note={note}
      handleNoteDataChange={handleNoteDataChange}
      selectNote={selectNote}
      deleteNote={deleteNote}
      saveNote={saveNote}
      searchPref={searchPref}
      handleSearchPrefDataChange={handleSearchPrefDataChange}
      toggleSearchPref={toggleSearchPref}
      clearSearch={clearSearch}
      filterPref={filterPref}
      handleFilterPrefDataChange={handleFilterPrefDataChange}
      search={search}
    />
  );
};

const mapStateToProps = state => ({
  note: state.note,
});

export default connect(mapStateToProps, { fetchNote, saveNote, deleteNote })(
  NoteController
);
