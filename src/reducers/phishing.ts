import {ActionPayload} from 'actions/interfaces';
import {FETCH_PHISHING_ACCOUNTS} from 'actions/types';

export default (
  state: string[] = [],
  {type, payload}: ActionPayload<string[]>,
) => {
  switch (type) {
    case FETCH_PHISHING_ACCOUNTS:
      return payload!;
    default:
      return state;
  }
};
