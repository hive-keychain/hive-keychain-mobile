import {actionPayload, conversion} from 'actions/interfaces';
import {FETCH_CONVERSION_REQUESTS} from 'actions/types';

export default (
  state: [conversion?] = [],
  {type, payload}: actionPayload<[conversion?]>,
) => {
  switch (type) {
    case FETCH_CONVERSION_REQUESTS:
      return payload;
    default:
      return state;
  }
};
