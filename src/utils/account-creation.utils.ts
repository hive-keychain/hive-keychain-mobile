import {AuthorityType, PrivateKey} from '@hiveio/dhive';
import {getRandomValues} from '@react-native-module/get-random-values';
import {Account} from 'actions/interfaces';
import {Key} from 'src/interfaces/keys.interface';
import AccountUtils from './account.utils';
import {createClaimedAccount, createNewAccount} from './hive';

export enum AccountCreationType {
  USING_TICKET = 'USING_TICKET',
  BUYING = 'BUYING',
}

export interface GeneratedKey {
  public: string;
  private: string;
}

export interface GeneratedKeys {
  owner: GeneratedKey;
  active: GeneratedKey;
  posting: GeneratedKey;
  memo: GeneratedKey;
}

export interface AccountAuthorities {
  owner: AuthorityType;
  active: AuthorityType;
  posting: AuthorityType;
  memo_key: string;
}

const checkAccountNameAvailable = async (username: string) => {
  const account = await AccountUtils.getAccount(username);
  return account.length !== 0 ? false : true;
};

const generateMasterKey = () => {
  const array = new Uint32Array(10);
  const arrayrandomised = getRandomValues(array);
  const masterRandomised =
    'P' + PrivateKey.fromSeed(arrayrandomised.toString()).toString();
  return masterRandomised;
};

const validateUsername = (username: string) => {
  return new RegExp(
    /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z\-](?=[0-9a-z])){2,}([\.](?=[a-z][0-9a-z\-][0-9a-z\-])[a-z]([0-9a-z]|[0-9a-z\-](?=[0-9a-z])){1,}){0,}$/,
  ).test(username);
};

const createAccount = async (
  creationType: AccountCreationType,
  newUsername: string,
  parentUsername: string,
  parentActiveKey: Key,
  authorities: AccountAuthorities,
  price?: number,
  generatedKeys?: GeneratedKeys,
) => {
  let success = null;
  switch (creationType) {
    case AccountCreationType.BUYING: {
      success = await createPayingAccount(
        authorities,
        newUsername,
        parentUsername,
        parentActiveKey,
        price!,
      );
      break;
    }
    case AccountCreationType.USING_TICKET: {
      success = await createClaimedAccount(parentActiveKey, {
        creator: parentUsername,
        new_account_name: newUsername,
        json_metadata: '{}',
        extensions: [],
        ...authorities,
      });
      break;
    }
  }
  if (success && generatedKeys) {
    return {
      name: newUsername,
      keys: {
        active: generatedKeys.active.private,
        activePubkey: generatedKeys.active.public,
        posting: generatedKeys.posting.private,
        postingPubkey: generatedKeys.posting.public,
        memo: generatedKeys.memo.private,
        memoPubkey: generatedKeys.memo.public,
      },
    } as Account;
  } else {
    return false;
  }
};

const createPayingAccount = async (
  authorities: AccountAuthorities,
  newUsername: string,
  parentUsername: string,
  parentActiveKey: Key,
  price: number,
) => {
  return await createNewAccount(parentActiveKey, {
    fee: `${price.toFixed(3)} HIVE`,
    creator: parentUsername,
    new_account_name: newUsername,
    json_metadata: '{}',
    ...authorities,
  });
};
/* istanbul ignore next */
const generateAccountAuthorities = (
  keys: GeneratedKeys,
): AccountAuthorities => {
  return {
    owner: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keys.owner.public, 1]],
    },
    active: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keys.active.public, 1]],
    },
    posting: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keys.posting.public, 1]],
    },
    memo_key: keys.memo.public,
  };
};

export const AccountCreationUtils = {
  checkAccountNameAvailable,
  generateMasterKey,
  validateUsername,
  createAccount,
  generateAccountAuthorities,
};
