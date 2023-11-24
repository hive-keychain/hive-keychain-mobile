import {ActionPayload, FloatingBarPayload} from 'actions/interfaces';
import {
  HIDE_FLOATING_BAR,
  SET_IS_DRAWER_OPEN,
  SET_IS_LOADING_SCREEN,
  SHOW_FLOATING_BAR,
} from 'actions/types';

const INITIAL_STATE: FloatingBarPayload = {
  show: false,
  isLoadingScreen: true,
  isDrawerOpened: false,
};

export default (
  state: FloatingBarPayload = INITIAL_STATE,
  {type, payload}: ActionPayload<FloatingBarPayload>,
) => {
  switch (type) {
    case SHOW_FLOATING_BAR:
      return {...state, show: payload.show};
    case SET_IS_LOADING_SCREEN:
      return {...state, isLoadingScreen: payload.isLoadingScreen};
    case SET_IS_DRAWER_OPEN:
      return {...state, isDrawerOpened: payload.isDrawerOpened};
    case HIDE_FLOATING_BAR:
      return INITIAL_STATE;
    default:
      return state;
  }
};
