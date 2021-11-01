import {HAS_ConnectPayload} from 'utils/hiveAuthenticationService';
import {HAS_Actions} from './types';

export const treatHASRequest = (data: HAS_ConnectPayload) => {
  return {
    type: HAS_Actions.REQUEST,
    payload: {data},
  };
};

export const showHASInitRequestAsTreated = () => {
  return {
    type: HAS_Actions.REQUEST_TREATED,
  };
};
