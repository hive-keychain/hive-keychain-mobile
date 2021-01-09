import {FETCH_CONVERSION_REQUESTS} from 'actions/types';

export default (state = [], {type, payload}) => {
  switch (type) {
    case FETCH_CONVERSION_REQUESTS:
      return payload;
    default:
      return state;
  }
};
