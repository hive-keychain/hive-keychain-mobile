import {ActionPayload} from './interfaces';
import {SET_ACCOUNT_VALUE_DISPLAY} from './types';

export const setAccountValueDisplay = (
  number: number,
): ActionPayload<number> => {
  return {
    type: SET_ACCOUNT_VALUE_DISPLAY,
    payload: number,
  };
};
