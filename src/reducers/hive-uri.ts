import {ActionPayload} from 'actions/interfaces';
import {HiveURIActionTypes} from 'actions/types';
import {DecodeResult} from 'hive-uri';
import {HiveUriOpType} from 'utils/hiveUri.utils';

export default (
  state: {operation?: DecodeResult; opType?: HiveUriOpType} = {},
  {
    type,
    payload,
  }: ActionPayload<
    {operation: DecodeResult; opType: HiveUriOpType} | undefined
  >,
) => {
  switch (type) {
    case HiveURIActionTypes.SAVE_OPERATION:
      return {...payload};
    case HiveURIActionTypes.FORGET_OPERATION:
      return {};
    default:
      return state;
  }
};
