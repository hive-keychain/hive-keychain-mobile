import {ActionPayload, MessageModalPayload} from 'actions/interfaces';
import {RESET_MODAL, SHOW_MODAL} from 'actions/types';
import {MessageModalType} from 'src/enums/messageModal.enums';

const INITIAL_STATE: MessageModalPayload = {
  key: '',
  type: MessageModalType.SUCCESS,
};

export default (
  state = INITIAL_STATE,
  {type, payload}: ActionPayload<MessageModalPayload>,
) => {
  switch (type) {
    case SHOW_MODAL:
      return {...state, ...payload};
    case RESET_MODAL:
      return INITIAL_STATE;
    default:
      return state;
  }
};
