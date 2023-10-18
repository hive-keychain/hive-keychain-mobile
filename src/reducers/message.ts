import {ActionPayload, MessageModalPayload} from 'actions/interfaces';
import {RESET_MODAL, SHOW_MODAL} from 'actions/types';

const INITIAL_STATE: MessageModalPayload = {
  show: false,
  message: '',
};

export default (
  state: {show: boolean; message: string} = INITIAL_STATE,
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
