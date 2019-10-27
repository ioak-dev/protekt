import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';

export default combineReducers({
    authorization: AuthReducer,
    profile: ProfileReducer
})