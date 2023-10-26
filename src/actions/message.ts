import {MessageModalType} from 'src/enums/messageModal.enums';
import {ActionPayload, MessageModalPayload} from './interfaces';
import {RESET_MODAL, SHOW_MODAL} from './types';

export const showModal = (
  key: string,
  type: MessageModalType,
  params?: {},
  skipTranslation?: boolean,
): ActionPayload<MessageModalPayload> => {
  return {
    type: SHOW_MODAL,
    payload: {
      key,
      type,
      params,
      skipTranslation,
    },
  };
};

export const resetModal = (): ActionPayload<MessageModalPayload> => {
  return {
    type: RESET_MODAL,
  };
};
