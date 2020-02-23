import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import BookmarkReducer from './BookmarkReducer';
import NoteReducer from './NoteReducer';

export default combineReducers({
  authorization: AuthReducer,
  profile: ProfileReducer,
  bookmark: BookmarkReducer,
  note: NoteReducer,
});
