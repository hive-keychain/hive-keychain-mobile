import {DynamicGlobalProperties} from '@hiveio/dhive';
import {actionPayload} from 'actions/interfaces';
import {GLOBAL_PROPS} from 'actions/types';

const globalPropertiesReducer = (
  state: DynamicGlobalProperties | {} = {},
  {type, payload}: actionPayload<DynamicGlobalProperties>,
): DynamicGlobalProperties | {} => {
  switch (type) {
    case GLOBAL_PROPS:
      return payload!;
    default:
      return state;
  }
};

export default globalPropertiesReducer;
