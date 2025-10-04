import {Authority, ExtendedAccount} from '@hiveio/dhive';
import {AccountKeys} from 'actions/interfaces';
import hive, {getClient} from 'utils/hiveLibs.utils';
import {translate} from './localize';

const isMemoWif = (publicKey: string, memo: string) => {
  return publicKey === memo;
};

const getPubkeyWeight = (publicKey: string, permissions: Authority) => {
  for (let n in permissions.key_auths) {
    const keyWeight = permissions.key_auths[n];
    const lpub = keyWeight['0'];
    if (publicKey === lpub) {
      return keyWeight['1'];
    }
  }
  return 0;
};

const validatePrivateKey = (
  account: ExtendedAccount,
  pwd: string,
  publicKey: string,
): AccountKeys | null => {
  let keys: AccountKeys = {};
  if (isMemoWif(publicKey, account.memo_key)) {
    keys = {...keys, memo: pwd, memoPubkey: publicKey};
  }
  if (getPubkeyWeight(publicKey, account.posting)) {
    keys = {...keys, posting: pwd, postingPubkey: publicKey};
  }
  if (getPubkeyWeight(publicKey, account.active)) {
    keys = {...keys, active: pwd, activePubkey: publicKey};
  }
  return Object.keys(keys).length ? keys : null;
};

const derivateFromMasterPassword = (
  username: string,
  account: ExtendedAccount,
  pwd: string,
) => {
  const posting = hive.PrivateKey.fromLogin(username, pwd, 'posting');
  const active = hive.PrivateKey.fromLogin(username, pwd, 'active');
  const memo = hive.PrivateKey.fromLogin(username, pwd, 'memo');
  const keys = {
    posting: posting.toString(),
    active: active.toString(),
    memo: memo.toString(),
    postingPubkey: posting.createPublic().toString(),
    activePubkey: active.createPublic().toString(),
    memoPubkey: memo.createPublic().toString(),
  };
  const has_active = getPubkeyWeight(keys.activePubkey, account.active);
  const has_posting = getPubkeyWeight(keys.postingPubkey, account.posting);

  if (has_active || has_posting || keys.memoPubkey === account.memo_key) {
    const workingKeys: AccountKeys = {};
    if (has_active) {
      workingKeys.active = keys.active;
      workingKeys.activePubkey = keys.activePubkey;
    }
    if (has_posting) {
      workingKeys.posting = keys.posting;
      workingKeys.postingPubkey = keys.postingPubkey;
    }
    if (keys.memoPubkey === account.memo_key) {
      workingKeys.memo = keys.memo;
      workingKeys.memoPubkey = keys.memoPubkey;
    }
    return workingKeys;
  } else {
    return null;
  }
};

export const getPublicKeyFromPrivateKeyString = (pwd: string) => {
  try {
    const privateKey = hive.PrivateKey.fromString(pwd);
    const publicKey = privateKey.createPublic();
    return publicKey.toString();
  } catch (e) {
    return null;
  }
};

export const validateFromObject = async ({
  name,
  keys: {memo, posting, active},
}: {
  name: string;
  keys: AccountKeys;
}) => {
  const account = (await getClient().database.getAccounts([name]))[0];
  let keys = {};
  if (
    memo &&
    isMemoWif(getPublicKeyFromPrivateKeyString(memo)!, account.memo_key)
  ) {
    keys = {memo, memoPubkey: account.memo_key};
  }
  if (
    posting &&
    getPubkeyWeight(getPublicKeyFromPrivateKeyString(posting)!, account.posting)
  ) {
    keys = {
      ...keys,
      posting,
      postingPubkey: getPublicKeyFromPrivateKeyString(posting),
    };
  }
  if (
    active &&
    getPubkeyWeight(getPublicKeyFromPrivateKeyString(active)!, account.active)
  ) {
    keys = {
      ...keys,
      active,
      activePubkey: getPublicKeyFromPrivateKeyString(active),
    };
  }
  return Object.keys(keys).length ? keys : null;
};

export default async (
  username: string,
  pwd: string,
): Promise<AccountKeys | null> => {
  try {
    const accounts = await getClient().database.getAccounts([username.trim()]);
    const account = accounts[0];
    if (!account)
      throw new Error(
        translate('toast.account_not_in_hive', {account: username}),
      );
    const publicKey = getPublicKeyFromPrivateKeyString(pwd);
    if (pwd.startsWith('STM')) {
      throw 'This is a public key! Please enter a private key or your master key.';
    }
    if (publicKey) {
      return validatePrivateKey(account, pwd, publicKey);
    }
    return derivateFromMasterPassword(username, account, pwd);
  } catch (e) {
    throw new Error(e);
  }
};
