import {ExtendedAccount} from '@hiveio/dhive';
import {Account, AccountKeys} from 'actions/interfaces';
import {WrongKeysOnUser} from 'components/popups/wrong-key/WrongKeyPopup';
import {KeychainKeyTypesLC} from 'hive-keychain-commons';
import {Key, PrivateKeyType} from 'src/interfaces/keys.interface';

const isAuthorizedAccount = (key: string): boolean => {
  return key.toString().startsWith('@');
};

const keysCount = (keys: AccountKeys): number => {
  return keys ? Object.keys(keys).length : 0;
};

const hasKeys = (keys: AccountKeys): boolean => {
  return keysCount(keys) > 0;
};

const getKeyType = (
  privateKey: Key,
  publicKey?: Key,
  transactionAccount?: ExtendedAccount,
  initiatorAccount?: ExtendedAccount,
  method?: KeychainKeyTypesLC,
): PrivateKeyType => {
  //TODO commented code for future updates as Multisig.
  // if (
  //   transactionAccount &&
  //   initiatorAccount &&
  //   method &&
  //   KeysUtils.isUsingMultisig(
  //     privateKey,
  //     transactionAccount,
  //     initiatorAccount.name,
  //     method,
  //   )
  // ) {
  //   return PrivateKeyType.MULTISIG;
  // }

  if (privateKey?.toString().startsWith('#')) {
    return PrivateKeyType.LEDGER;
  } else if (publicKey?.toString().startsWith('@')) {
    return PrivateKeyType.AUTHORIZED_ACCOUNT;
  } else {
    return PrivateKeyType.PRIVATE_KEY;
  }
};

const isExportable = (
  privateKey: Key | undefined,
  publicKey: Key | undefined,
) => {
  if (privateKey && publicKey) {
    const keyType = KeyUtils.getKeyType(privateKey, publicKey);
    if (
      keyType === PrivateKeyType.PRIVATE_KEY ||
      keyType === PrivateKeyType.AUTHORIZED_ACCOUNT
    )
      return true;
  } else {
    return false;
  }
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
  getKeyType,
  isExportable,
  checkWrongKeyOnAccount,
  checkKeysOnAccount,
};
