import {MessageModalType} from 'src/enums/messageModal.enum';
import {ActionPayload, MessageModalPayload} from './interfaces';
import {RESET_MODAL, SHOW_MODAL} from './types';

export const showModal = (
  key: string,
  type: MessageModalType,
  params?: {},
  skipTranslation?: boolean,
  callback?: () => void,
): ActionPayload<MessageModalPayload> => {
  return {
    type: SHOW_MODAL,
    payload: {
      key,
      type,
      params,
      skipTranslation,
      callback,
    },
  };
};

export const resetModal = (): ActionPayload<MessageModalPayload> => {
  return {
    type: RESET_MODAL,
  };
};
