import { FETCH_NOTE } from '../actions/types';

const initialState = {
  items: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_NOTE:
      console.log('FETCH_NOTE reducer');
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
