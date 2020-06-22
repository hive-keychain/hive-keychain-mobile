import {SIGN_UP, LOCK, UNLOCK} from '../actions/types';

export default (state = {mk: null}, {type, payload}) => {
  switch (type) {
    case SIGN_UP:
      return {mk: payload};
    case LOCK:
      return {mk: null};
    case UNLOCK:
      return {mk: payload};
    default:
      return state;
  }
};
