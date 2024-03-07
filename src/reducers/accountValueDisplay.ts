import {ActionPayload} from 'actions/interfaces';
import {SET_ACCOUNT_VALUE_DISPLAY} from 'actions/types';

export default (state: number = 0, {type, payload}: ActionPayload<number>) => {
  switch (type) {
    case SET_ACCOUNT_VALUE_DISPLAY:
      return payload!;
    default:
      return state;
  }
};
