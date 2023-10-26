import {ActionPayload, MessageModalPayload} from 'actions/interfaces';
import {RESET_MODAL, SHOW_MODAL} from 'actions/types';

const INITIAL_STATE: MessageModalPayload = {
  show: false,
  messageKey: '',
  isError: false,
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
