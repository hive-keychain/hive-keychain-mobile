import {ActionPayload} from 'actions/interfaces';
import {HAS_Actions} from 'actions/types';
import {
  Connection,
  HAS_ConnectPayload,
} from 'utils/hiveAuthenticationService.types';

type HAS_InitState = {
  requiresInit: boolean;
  connections: Connection[];
  data?: HAS_ConnectPayload;
};

export default (
  state: HAS_InitState = {requiresInit: false, connections: []},
  {type, payload: data}: ActionPayload<HAS_ConnectPayload>,
) => {
  switch (type) {
    case HAS_Actions.REQUEST:
      return {requiresInit: true, data};
    case HAS_Actions.REQUEST_TREATED:
      return {requiresInit: false};
    default:
      return state;
  }
};
