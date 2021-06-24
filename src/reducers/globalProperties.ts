import {ActionPayload, GlobalProperties} from 'actions/interfaces';
import {GLOBAL_PROPS} from 'actions/types';

const globalPropertiesReducer = (
  state: GlobalProperties = {},
  {type, payload}: ActionPayload<GlobalProperties>,
): GlobalProperties => {
  switch (type) {
    case GLOBAL_PROPS:
      return payload!;
    default:
      return state;
  }
};

export default globalPropertiesReducer;
