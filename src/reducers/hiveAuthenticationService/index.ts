import {HAS_ActionsTypes} from 'actions/types';
import {
  HAS_Instance,
  HAS_Session,
} from 'utils/hiveAuthenticationService/has.types';
import {HAS_Actions} from './types';

export type HAS_State = {
  instances: HAS_Instance[];
  sessions: HAS_Session[];
};

//TODO : on retrieve state : instance init to false / delete expired or no token sessions

export default (
  state: HAS_State = {sessions: [], instances: []},
  data: HAS_Actions,
): HAS_State => {
  switch (data.type) {
    case HAS_ActionsTypes.REQUEST:
      const instances = [...state.instances];
      if (!state.instances.find((e) => e.host === data.payload.host)) {
        instances.push({host: data.payload.host, init: false});
      }
      return {
        instances,
        sessions: [...state.sessions, {...data.payload, init: false}],
      };
    case HAS_ActionsTypes.REQUEST_TREATED:
      return {
        instances: [
          ...state.instances.filter((e) => e.host !== data.payload),
          ...state.instances
            .filter((e) => e.host === data.payload)
            .map((e) => {
              e.init = true;
              return e;
            }),
        ],
        sessions: [
          ...state.sessions.filter((e) => e.host !== data.payload),
          ...state.sessions
            .filter((e) => e.host === data.payload)
            .map((e) => {
              e.init = true;
              return e;
            }),
        ],
      };
    case HAS_ActionsTypes.ADD_TOKEN: {
      const copyState = {...state};
      const session = copyState.sessions.find(
        (e) => e.uuid === data.payload.uuid,
      );
      if (!session) return state;
      session.token = data.payload.token;
      return copyState;
    }
    case HAS_ActionsTypes.ADD_SERVER_KEY:
      return {
        ...state,
        instances: [
          ...state.instances.filter((e) => e.host !== data.payload.host),
          {
            host: data.payload.host,
            init: true,
            server_key: data.payload.server_key,
          },
        ],
      };
    case HAS_ActionsTypes.CLEAR:
      console.log('clearing');
      return {sessions: [], instances: []};
    default:
      return state;
  }
};
