import {ActionPayload, MessageModalPayload} from './interfaces';
import {RESET_MODAL, SHOW_MODAL} from './types';

export const showModal = (
  show: boolean,
  message: string,
): ActionPayload<MessageModalPayload> => {
  return {
    type: SHOW_MODAL,
    payload: {
      show,
      message,
    },
  };
};

export const resetModal = (): ActionPayload<MessageModalPayload> => {
  return {
    type: RESET_MODAL,
  };
};
