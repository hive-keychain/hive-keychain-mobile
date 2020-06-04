import {SIGN_UP} from '../actions/types';

export default (state = {mk: null}, {type, payload}) => {
  switch (type) {
    case SIGN_UP:
      return {mk: payload};
    default:
      return state;
  }
};
