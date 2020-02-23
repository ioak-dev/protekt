import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import { isEmptyOrSpaces, match } from '../Utils';
import { sendMessage } from '../../events/MessageService';
import { Authorization } from '../Types/GeneralTypes';
import {
  fetchBookmark,
  saveBookmark,
  deleteBookmark,
} from '../../actions/BookmarkActions';
import BookmarkView from './BookmarkView';

const queryString = require('query-string');

interface Props {
  authorization: Authorization;
  location: any;
  logout: Function;

  fetchBookmark: Function;
  saveBookmark: Function;
  deleteBookmark: Function;
  bookmark: any;
}

const BookmarkController = (props: Props) => {
  const [bookmark, setBookmark] = useState({
    id: undefined,
    title: '',
    href: '',
    tags: '',
  });

  const [searchPref, setSearchPref] = useState({
    title: true,
    tags: true,
    href: true,
    content: true,
    searchText: '',
    filtered: false,
    filterActivator: false,
  });

  const [firstLoad, setFirstLoad] = useState(true);
  const [view, setView] = useState([]);

  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      if (query && query.q) {
        if (query.q.startsWith('tags')) {
          setSearchPref({
            ...searchPref,
            title: false,
            tags: true,
            href: true,
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
      props.fetchBookmark(props.authorization);
      setFirstLoad(false);
    }
  }, [props.authorization]);

  useEffect(() => {
    setSearchPref({
      ...searchPref,
      filterActivator: !searchPref.filterActivator,
    });
  }, [props.bookmark]);

  useEffect(() => {
    search();
  }, [searchPref.filterActivator]);

  const selectBookmark = bookmark => {
    setBookmark({
      id: bookmark ? bookmark._id : '',
      title: bookmark ? bookmark.title : '',
      href: bookmark ? bookmark.href : '',
      tags: bookmark ? bookmark.tags : '',
    });
  };

  const deleteBookmark = bookmarkId => {
    props.deleteBookmark(props.authorization, bookmarkId);
  };

  const clearSearch = () => {
    setView(props.bookmark?.items);
    setFirstLoad(false);
    setSearchPref({
      ...searchPref,
      searchText: '',
      filterActivator: !searchPref.filterActivator,
    });
    sendMessage('sidebar', false);
  };

  const searchByTag = tagName => {
    setSearchPref({
      ...searchPref,
      title: false,
      tags: true,
      href: false,
      searchText: tagName,
      filterActivator: !searchPref.filterActivator,
    });
  };

  const search = (event?: any) => {
    if (event) {
      event.preventDefault();
    }
    if (isEmptyOrSpaces(searchPref.searchText)) {
      setView(props.bookmark?.items);
      setSearchPref({ ...searchPref, filtered: false });
      return;
    }

    setView(
      props.bookmark?.items?.filter(item => {
        if (searchPref.title && match(item.title, searchPref.searchText)) {
          return true;
        }
        if (searchPref.tags && match(item.tags, searchPref.searchText)) {
          return true;
        }
        if (searchPref.href && match(item.href, searchPref.searchText)) {
          return true;
        }
      })
    );
    setSearchPref({ ...searchPref, filtered: true });
    sendMessage('sidebar', false);
  };

  const toggleSearchPref = pref => {
    setSearchPref({
      ...searchPref,
      [pref]: !searchPref[pref],
    });
  };

  const update = () => {
    if (isEmptyOrSpaces(bookmark.title)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Title / description missing',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(bookmark.href)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Website URL / Link is missing',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(bookmark.tags)) {
      setBookmark({ ...bookmark, tags: 'unsorted' });
    }

    props.saveBookmark(props.authorization, bookmark);
  };

  const handleBookmarkDataChange = event => {
    setBookmark({
      ...bookmark,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSearchPrefDataChange = event => {
    setSearchPref({
      ...searchPref,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  return (
    <BookmarkView
      view={view}
      bookmark={bookmark}
      handleBookmarkDataChange={handleBookmarkDataChange}
      selectBookmark={selectBookmark}
      update={update}
      deleteBookmark={deleteBookmark}
      searchPref={searchPref}
      handleSearchPrefDataChange={handleSearchPrefDataChange}
      toggleSearchPref={toggleSearchPref}
      clearSearch={clearSearch}
      search={search}
      searchByTag={searchByTag}
    />
  );
};

const mapStateToProps = state => ({
  bookmark: state.bookmark,
});

export default connect(mapStateToProps, {
  fetchBookmark,
  saveBookmark,
  deleteBookmark,
})(BookmarkController);
