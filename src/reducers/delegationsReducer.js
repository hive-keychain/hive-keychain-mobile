import {FETCH_DELEGATEES, FETCH_DELEGATORS} from 'actions/types';

const delegationsReducer = (
  state = {incoming: [], outgoing: []},
  {type, payload},
) => {
  switch (type) {
    case FETCH_DELEGATEES:
      return {...state, outgoing: payload};
    case FETCH_DELEGATORS:
      return {...state, incoming: payload};
    default:
      return state;
  }
};

export default delegationsReducer;
