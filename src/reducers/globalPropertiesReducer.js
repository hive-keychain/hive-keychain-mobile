import {GLOBAL_PROPS} from 'actions/types';

const globalPropertiesReducer = (state = {}, {type, payload}) => {
  switch (type) {
    case GLOBAL_PROPS:
      return payload;
    default:
      return state;
  }
};

export default globalPropertiesReducer;
