import {ActionPayload, Conversion} from 'actions/interfaces';
import {FETCH_CONVERSION_REQUESTS} from 'actions/types';

export default (
  state: Conversion[] = [],
  {type, payload}: ActionPayload<Conversion[]>,
) => {
  switch (type) {
    case FETCH_CONVERSION_REQUESTS:
      return payload!;
    default:
      return state;
  }
};
