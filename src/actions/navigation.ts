import {ActionPayload} from './interfaces';
import {UPDATE_NAVIGATION_SCREEN} from './types';

export const updateNavigationActiveScreen = (
  screen: string,
): ActionPayload<string> => {
  return {
    type: UPDATE_NAVIGATION_SCREEN,
    payload: screen,
  };
};
