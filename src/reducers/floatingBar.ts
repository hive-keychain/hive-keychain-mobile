import {ActionPayload, FloatingBarPayload} from 'actions/interfaces';
import {HIDE_FLOATING_BAR, SHOW_FLOATING_BAR} from 'actions/types';

const INITIAL_STATE: FloatingBarPayload = {
  show: false,
};

export default (
  state = INITIAL_STATE,
  {type, payload}: ActionPayload<FloatingBarPayload>,
) => {
  switch (type) {
    case SHOW_FLOATING_BAR:
      return {...state, ...payload};
    case HIDE_FLOATING_BAR:
      return INITIAL_STATE;
    default:
      return state;
  }
};
