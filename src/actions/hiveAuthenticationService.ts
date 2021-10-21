import {HAS_RequestPayload} from 'utils/HAS';
import {HAS_Actions} from './types';

export const treatHASRequest = (data: HAS_RequestPayload) => {
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
