import {FETCH_PHISHING_ACCOUNTS} from 'actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case FETCH_PHISHING_ACCOUNTS:
      return payload;
    default:
      return state;
  }
};
