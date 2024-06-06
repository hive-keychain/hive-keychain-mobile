import {ExtendedAccount} from '@hiveio/dhive';
import {AccountKeys} from 'actions/interfaces';
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

export const KeyUtils = {
  isAuthorizedAccount,
  hasKeys,
  keysCount,
  getKeyType,
  isExportable,
};
