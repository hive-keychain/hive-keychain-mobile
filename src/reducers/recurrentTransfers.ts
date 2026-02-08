import {ActionPayload} from 'actions/interfaces';
import {FETCH_RECURRENT_TRANSFERS} from 'actions/types';
import {PendingRecurrentTransfer} from 'src/interfaces/transaction.interface';

export default (
  state: PendingRecurrentTransfer[] = [],
  {type, payload}: ActionPayload<PendingRecurrentTransfer[]>,
) => {
  switch (type) {
    case FETCH_RECURRENT_TRANSFERS:
      return payload;
    default:
      return state;
  }
};
