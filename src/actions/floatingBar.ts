import {ActionPayload} from './interfaces';
import {
  HIDE_FLOATING_BAR,
  SET_IS_DRAWER_OPEN,
  SET_IS_LOADING_SCREEN,
  SHOW_FLOATING_BAR,
  UPDATE_FLOATING_BAR,
} from './types';

export const showFloatingBar = (
  show: boolean,
): ActionPayload<{show: boolean}> => {
  return {
    type: SHOW_FLOATING_BAR,
    payload: {show},
  };
};

export const updateFloatingBar = (
  isProposalRequestDisplayed: boolean,
): ActionPayload<{isProposalRequestDisplayed: boolean}> => {
  return {
    type: UPDATE_FLOATING_BAR,
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

export const hideFloatingBar = () => {
  return {
    type: HIDE_FLOATING_BAR,
  };
};
