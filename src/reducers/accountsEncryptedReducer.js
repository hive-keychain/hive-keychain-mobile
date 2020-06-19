import {UPDATE_ACCOUNT_ENC} from '../actions/types';

export default (state = [], {type, payload}) => {
  //console.log('b', state, type, payload);
  switch (type) {
    case UPDATE_ACCOUNT_ENC:
      return payload;
    default:
      return state;
  }
};
