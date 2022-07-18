import {Operation} from '@hiveio/dhive';
import {ActionPayload} from 'actions/interfaces';
import {HiveURIActionTypes} from 'actions/types';

export default (
  state: {operation?: Operation} = {},
  {type, payload}: ActionPayload<Operation | undefined>,
) => {
  switch (type) {
    case HiveURIActionTypes.SAVE_OPERATION:
      return {operation: payload};
    case HiveURIActionTypes.FORGET_OPERATION:
      return {};
    default:
      return state;
  }
};
