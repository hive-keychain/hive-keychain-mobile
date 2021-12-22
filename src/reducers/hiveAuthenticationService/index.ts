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
      data.payload.host = data.payload.host.replace(/\/$/, '');
      const instances = [...state.instances];
      if (!state.instances.find((e) => e.host === data.payload.host)) {
        instances.push({host: data.payload.host, init: false});
      }
      return {
        instances,
        sessions: [...state.sessions, {...data.payload, init: false}],
      };
    case HAS_ActionsTypes.REQUEST_TREATED:
      console.log(data);
      console.log({
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
      });
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
    case HAS_ActionsTypes.ADD_SERVER_KEY: {
      const instance = state.instances.find(
        (e) => e.host === data.payload.host,
      );
      instance.init = true;
      instance.server_key = data.payload.server_key;
      return {
        ...state,
        instances: [
          ...state.instances.filter((e) => e.host !== data.payload.host),
          instance,
        ],
      };
    }
    case HAS_ActionsTypes.CLEAR:
      console.log('clearing');
      return {sessions: [], instances: []};
    case HAS_ActionsTypes.UPDATE_INSTANCE_CONNECTION_STATUS:
      const instance = state.instances.find(
        (e) => e.host === data.payload.host,
      );
      if (!instance) return state;
      instance.connected = data.payload.connected;
      return {
        ...state,
        instances: [
          ...state.instances.filter((e) => e.host !== data.payload.host),
          instance,
        ],
      };
    case HAS_ActionsTypes.REMOVE_SESSION: {
      console.log('rm');
      const sessions = state.sessions.filter(
        (session) => session.uuid !== data.payload.uuid,
      );
      const instances = state.instances.filter(
        (e) => !!sessions.find((session) => e.host === session.host),
      );
      console.log('removing', {instances, sessions});
      return {
        instances,
        sessions,
      };
    }
    default:
      return state;
  }
};
