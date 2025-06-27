import {ActionPayload} from 'actions/interfaces';
import {HiveURIActionTypes} from 'actions/types';
import {DecodeResult} from 'hive-uri';

export default (
  state: {operation?: DecodeResult} = {},
  {type, payload}: ActionPayload<DecodeResult | undefined>,
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
