import { FETCH_BOOKMARK } from '../actions/types';

const initialState = {
  items: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_BOOKMARK:
      console.log('FETCH_BOOKMARK reducer');
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
