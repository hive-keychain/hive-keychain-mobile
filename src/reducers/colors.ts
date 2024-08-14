import {ActionPayload} from 'actions/interfaces';
import {GET_BACKGROUND_COLORS} from 'actions/types';
import {Colors} from 'utils/colors';

const colorsReducer = (
  state: Colors = {},
  {type, payload}: ActionPayload<Colors>,
) => {
  switch (type) {
    case GET_BACKGROUND_COLORS:
      return payload;
    default:
      return state;
  }
};
export default colorsReducer;
