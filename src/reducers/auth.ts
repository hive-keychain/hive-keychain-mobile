import {SIGN_UP, LOCK, UNLOCK} from 'actions/types';
import {actionPayload, auth, nullableString} from 'actions/interfaces';

const authReducer = (
  state: auth = {mk: null},
  {type, payload}: actionPayload<nullableString>,
) => {
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

export default authReducer;
