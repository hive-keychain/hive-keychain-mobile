import {ActionPayload, FloatingBarPayload} from 'actions/interfaces';
import {
  HIDE_FLOATING_BAR,
  SCROLL_SHOW_FLOATING_BAR,
  SET_IS_DRAWER_OPEN,
  SET_IS_LOADING_SCREEN,
  UPDATE_SHOW_PROPOSAL_REMINDER,
} from 'actions/types';

const INITIAL_STATE: FloatingBarPayload = {
  showBasedOnScroll: false,
  isLoadingScreen: true,
  isDrawerOpened: false,
  isProposalRequestDisplayed: false,
  hide: false,
};

export default (
  state: FloatingBarPayload = INITIAL_STATE,
  {type, payload}: ActionPayload<FloatingBarPayload>,
) => {
  switch (type) {
    case SCROLL_SHOW_FLOATING_BAR:
      return {...state, showBasedOnScroll: payload.showBasedOnScroll};
    case UPDATE_SHOW_PROPOSAL_REMINDER:
      return {...state, ...payload};
    case SET_IS_LOADING_SCREEN:
      return {...state, isLoadingScreen: payload.isLoadingScreen};
    case SET_IS_DRAWER_OPEN:
      return {...state, isDrawerOpened: payload.isDrawerOpened};
    case HIDE_FLOATING_BAR:
      return {
        ...state,
        hide: !state.hide,
        showBasedOnScroll: true,
      };
    default:
      return state;
  }
};
