import {ActionPayload, MessageModalPayload} from './interfaces';
import {RESET_MODAL, SHOW_MODAL} from './types';
//TODO create enum to have different types of modal:
//  - for now:
//    - success, error.
export const showModal = (
  show: boolean,
  messageKey: string,
  isError?: boolean,
): ActionPayload<MessageModalPayload> => {
  return {
    type: SHOW_MODAL,
    payload: {
      show,
      messageKey,
      isError,
    },
  };
};

export const resetModal = (): ActionPayload<MessageModalPayload> => {
  return {
    type: RESET_MODAL,
  };
};
