import {ActionPayload} from './interfaces';
import {
  HIDE_FLOATING_BAR,
  SCROLL_SHOW_FLOATING_BAR,
  SET_IS_DRAWER_OPEN,
  SET_IS_LOADING_SCREEN,
  UPDATE_SHOW_PROPOSAL_REMINDER,
} from './types';

export const showFloatingBar = (
  showBasedOnScroll: boolean,
): ActionPayload<{showBasedOnScroll: boolean}> => {
  return {
    type: SCROLL_SHOW_FLOATING_BAR,
    payload: {showBasedOnScroll},
  };
};

export const updateShowProposalReminder = (
  isProposalRequestDisplayed: boolean,
): ActionPayload<{isProposalRequestDisplayed: boolean}> => {
  return {
    type: UPDATE_SHOW_PROPOSAL_REMINDER,
    payload: {isProposalRequestDisplayed},
  };
};

export const setisLoadingScreen = (
  isLoadingScreen: boolean,
): ActionPayload<{isLoadingScreen: boolean}> => {
  return {
    type: SET_IS_LOADING_SCREEN,
    payload: {isLoadingScreen},
  };
};

export const setIsDrawerOpen = (
  isDrawerOpened: boolean,
): ActionPayload<{isDrawerOpened: boolean}> => {
  return {
    type: SET_IS_DRAWER_OPEN,
    payload: {isDrawerOpened},
  };
};

export const toggleHideFloatingBar = () => {
  return {
    type: HIDE_FLOATING_BAR,
  };
};
