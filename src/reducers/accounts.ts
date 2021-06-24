import {Account, AccountsPayload, ActionPayload} from 'actions/interfaces';
import {
  ADD_ACCOUNT,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
  INIT_ACCOUNTS,
  LOCK,
  UPDATE_ACCOUNTS,
} from 'actions/types';

export default (
  state: Account[] = [],
  {type, payload}: ActionPayload<AccountsPayload>,
) => {
  console.log(type, payload);
  switch (type) {
    case ADD_ACCOUNT:
      return [...state, payload!.account!];
    case FORGET_ACCOUNT:
      return state.filter((e) => e!.name !== payload!.name!);
    case INIT_ACCOUNTS:
    case UPDATE_ACCOUNTS:
      return payload!.accounts!;
    case LOCK:
      return [];
    case FORGET_ACCOUNTS:
      return [];
    default:
      return state;
  }
};
