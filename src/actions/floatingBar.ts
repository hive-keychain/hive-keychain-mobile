import {ActionPayload, FloatingBarPayload} from './interfaces';
import {HIDE_FLOATING_BAR, SHOW_FLOATING_BAR} from './types';

export const showFloatingBar = (
  show: boolean,
): ActionPayload<FloatingBarPayload> => {
  return {
    type: SHOW_FLOATING_BAR,
    payload: {show},
  };
};

export const hideFloatingBar = (): ActionPayload<FloatingBarPayload> => {
  return {
    type: HIDE_FLOATING_BAR,
  };
};
