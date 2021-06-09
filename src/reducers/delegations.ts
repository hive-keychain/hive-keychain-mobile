import {
  actionPayload,
  delegations,
  incomingDelegation,
  outgoingDelegation,
} from 'actions/interfaces';
import {FETCH_DELEGATEES, FETCH_DELEGATORS} from 'actions/types';

const delegationsReducer = (
  state: delegations = {incoming: [], outgoing: []},
  {type, payload}: actionPayload<[incomingDelegation?] | [outgoingDelegation?]>,
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
