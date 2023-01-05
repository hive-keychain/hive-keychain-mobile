import {AccountKeys} from 'actions/interfaces';

const isAuthorizedAccount = (key: string): boolean => {
  return key.toString().startsWith('@');
};

const keysCount = (keys: AccountKeys): number => {
  return keys ? Object.keys(keys).length : 0;
};

const hasKeys = (keys: AccountKeys): boolean => {
  return keysCount(keys) > 0;
};

export const KeyUtils = {
  isAuthorizedAccount,
  hasKeys,
  keysCount,
};
