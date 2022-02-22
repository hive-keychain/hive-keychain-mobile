import {RootState, store} from 'store';

export const getLeastDangerousKey = (username: string) => {
  const accounts = (store.getState() as RootState).accounts;
  const account = accounts.find((e) => e.name === username);
  if (!account) return null;
  else if (account.keys.memo) {
    return {type: 'memo', value: account.keys.memo};
  } else if (account.keys.posting) {
    return {type: 'posting', value: account.keys.posting};
  } else {
    return {type: 'active', value: account.keys.active};
  }
};
