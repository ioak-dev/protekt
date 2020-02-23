import { GET_AUTH, ADD_AUTH, REMOVE_AUTH } from '../actions/types';

const initialState = {
  isAuth: false,
  token: '',
  secret: '',
  name: '',
  password: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_AUTH:
      console.log('GET_AUTH reducer');
      return {
        ...state,
      };
    case ADD_AUTH:
      console.log('ADD_AUTH reducer');
      return {
        ...state,
        ...action.payload,
      };
    case REMOVE_AUTH:
      console.log('REMOVE_AUTH reducer');
      return {
        ...state,
        isAuth: false,
        token: '',
        secret: '',
        name: '',
        password: '',
      };
    default:
      return state;
  }
}
