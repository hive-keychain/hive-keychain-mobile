import {ActionPayload, Auth, NullableString} from 'actions/interfaces';
import {LOCK, SIGN_UP, UNLOCK} from 'actions/types';

const authReducer = (
  state: Auth = {mk: null},
  {type, payload}: ActionPayload<NullableString>,
) => {
  switch (type) {
    case SIGN_UP:
      return {mk: payload!};
    case LOCK:
      return {mk: null};
    case UNLOCK:
      return {mk: payload!};
    default:
      return state;
  }
};

export default authReducer;
