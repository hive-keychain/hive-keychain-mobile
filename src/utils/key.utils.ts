import {ExtendedAccount} from '@hiveio/dhive';
import {Account, AccountKeys} from 'actions/interfaces';
import {WrongKeysOnUser} from 'components/popups/wrong-key/WrongKeyPopup';
import {KeychainKeyTypesLC} from 'hive-keychain-commons';

const isAuthorizedAccount = (key: string): boolean => {
  return key.toString().startsWith('@');
};

const keysCount = (keys: AccountKeys): number => {
  return keys ? Object.keys(keys).length : 0;
};

const hasKeys = (keys: AccountKeys): boolean => {
  return keysCount(keys) > 0;
};

const checkWrongKeyOnAccount = (
  key: string,
  value: string,
  accountName: string,
  extendedAccount: ExtendedAccount,
  foundWrongKey: WrongKeysOnUser,
  skipKey?: boolean,
) => {
  if (skipKey || !key.includes('Pubkey') || String(value).includes('@')) {
    return foundWrongKey;
  }
  const keyType = key.split('Pubkey')[0];
  console.log('checkWrongKeyOnAccount', {keyType}); //TODO remove line
  if (
    keyType === KeychainKeyTypesLC.active ||
    keyType === KeychainKeyTypesLC.posting
  ) {
    if (
      !extendedAccount[keyType].key_auths.find(
        (keyAuth) => keyAuth[0] === value,
      )
    ) {
      foundWrongKey[accountName].push(keyType);
    }
  } else if (
    keyType === KeychainKeyTypesLC.memo &&
    extendedAccount['memo_key'] !== value
  ) {
    foundWrongKey[accountName].push(keyType);
  }
  return foundWrongKey;
};

const checkKeysOnAccount = (
  account: Account,
  extendedAccount: any,
  noKeyCheck: WrongKeysOnUser,
) => {
  const {name: accountName, keys} = account;
  let foundWrongKey: WrongKeysOnUser = {[accountName!]: []};

  if (!noKeyCheck.hasOwnProperty(accountName!)) {
    noKeyCheck = {...noKeyCheck, [accountName!]: []};
  }

  Object.entries(keys).forEach(([key, value]) => {
    if (!value.length) return;

    const isKeyInNoCheckList = !!noKeyCheck[accountName!].find(
      (keyName: string) => keyName === key.split('Pubkey')[0],
    );

    foundWrongKey = KeyUtils.checkWrongKeyOnAccount(
      key,
      value,
      accountName!,
      extendedAccount,
      foundWrongKey,
      isKeyInNoCheckList,
    );
  });

  return foundWrongKey;
};

export const KeyUtils = {
  isAuthorizedAccount,
  hasKeys,
  keysCount,
  checkWrongKeyOnAccount,
  checkKeysOnAccount,
};
