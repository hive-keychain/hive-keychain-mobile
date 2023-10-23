import {ActionPayload, MessageModalPayload} from './interfaces';
import {RESET_MODAL, SHOW_MODAL} from './types';

export const showModal = (
  show: boolean,
  message: string,
  isError?: boolean,
): ActionPayload<MessageModalPayload> => {
  return {
    type: SHOW_MODAL,
    payload: {
      show,
      message,
      isError,
    },
  };
};

export const resetModal = (): ActionPayload<MessageModalPayload> => {
  return {
    type: RESET_MODAL,
  };
};