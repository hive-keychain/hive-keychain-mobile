import {AuthorityType, PrivateKey} from '@hiveio/dhive';
import {Account} from 'actions/interfaces';
import {AccountsUtils} from 'hive-keychain-commons';
import {Key} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import AccountUtils from './account.utils';
import {createClaimedAccount, createNewAccount} from './hiveLibs.utils';
import {translate} from './localize';

export enum AccountCreationType {
  USING_TICKET = 'USING_TICKET',
  BUYING = 'BUYING',
  PEER_TO_PEER = 'PEER_TO_PEER',
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
  const arrayrandomised = crypto.getRandomValues(array);
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
  options?: TransactionOptions,
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
        options,
      );
      break;
    }
    case AccountCreationType.USING_TICKET: {
      success = await createClaimedAccount(
        parentActiveKey,
        {
          creator: parentUsername,
          new_account_name: newUsername,
          json_metadata: '{}',
          extensions: [],
          ...authorities,
        },
        options,
      );
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
  } else if (success && !generatedKeys) {
    return true;
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
  options?: TransactionOptions,
) => {
  return await createNewAccount(
    parentActiveKey,
    {
      fee: `${price.toFixed(3)} HIVE`,
      creator: parentUsername,
      new_account_name: newUsername,
      json_metadata: '{}',
      ...authorities,
    },
    options,
  );
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

const validateNewAccountName = async (username: string, simpleToast: any) => {
  const accountValidation = await AccountsUtils.validateUsername(username);
  switch (accountValidation) {
    case AccountsUtils.UsernameValidation.too_short:
      simpleToast.show(translate('toast.username_too_short'));
      return false;
    case AccountsUtils.UsernameValidation.too_long:
      simpleToast.show(translate('toast.username_too_long'));
      return false;
    case AccountsUtils.UsernameValidation.invalid_last_character:
      simpleToast.show(translate('toast.username_invalid_last_character'));
      return false;
    case AccountsUtils.UsernameValidation.invalid_first_character:
      simpleToast.show(translate('toast.username_invalid_first_character'));
      return false;
    case AccountsUtils.UsernameValidation.invalid_middle_characters:
      simpleToast.show(translate('toast.username_invalid_middle_characters'));
      return false;
    case AccountsUtils.UsernameValidation.invalid_segment_length:
      simpleToast.show(translate('toast.username_invalid_segment_length'));
      return false;
    case AccountsUtils.UsernameValidation.valid:
      if (await AccountCreationUtils.checkAccountNameAvailable(username)) {
        return true;
      } else {
        simpleToast.show(translate('toast.account_username_already_used'));
        return false;
      }
    default:
      return false;
  }
};

export const AccountCreationUtils = {
  checkAccountNameAvailable,
  generateMasterKey,
  validateUsername,
  createAccount,
  generateAccountAuthorities,
  validateNewAccountName,
};
