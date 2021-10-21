import {ActionPayload} from 'actions/interfaces';
import {HAS_Actions} from 'actions/types';
import {HAS_RequestPayload} from 'utils/HAS';

type HAS_InitState = {
  requiresInit: boolean;
  data?: HAS_RequestPayload;
};

export default (
  state: HAS_InitState = {requiresInit: false},
  {type, payload: data}: ActionPayload<HAS_RequestPayload>,
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
