import {FETCH_PHISHING_ACCOUNTS} from 'actions/types';
import {actionPayload} from 'actions/interfaces';

export default (
  state: [string?] = [],
  {type, payload}: actionPayload<[string?]>,
) => {
  switch (type) {
    case FETCH_PHISHING_ACCOUNTS:
      return payload;
    default:
      return state;
  }
};
