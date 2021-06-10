import {actionPayload, globalProperties} from 'actions/interfaces';
import {GLOBAL_PROPS} from 'actions/types';

const globalPropertiesReducer = (
  state: globalProperties = {},
  {type, payload}: actionPayload<globalProperties>,
): globalProperties => {
  switch (type) {
    case GLOBAL_PROPS:
      return payload!;
    default:
      return state;
  }
};

export default globalPropertiesReducer;
