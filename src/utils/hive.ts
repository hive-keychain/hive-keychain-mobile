const hive = require('@hiveio/dhive');
import {
  AccountUpdateOperation,
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  Client,
  CollateralizedConvertOperation,
  CommentOptionsOperation,
  ConvertOperation,
  DelegateVestingSharesOperation,
  Operation,
  RecurrentTransferOperation,
  TransferOperation,
  UpdateProposalVotesOperation,
  VoteOperation,
} from '@hiveio/dhive';
import api from 'api/keychain';
import hiveTx from 'hive-tx';
import {hiveEngine} from 'utils/config';
import {
  KeychainKeyTypes,
  RequestAddAccountAuthority,
  RequestAddKeyAuthority,
  RequestPost,
  RequestRemoveAccountAuthority,
  RequestRemoveKeyAuthority,
} from './keychain.types';

type BroadcastResult = {id: string};

const DEFAULT_RPC = 'https://api.hive.blog';
let client = new Client(DEFAULT_RPC);
hiveTx.updateOperations();

const getDefault: () => Promise<string> = async () => {
  try {
    return (await api.get('/hive/rpc')).data.rpc;
  } catch (e) {
    return DEFAULT_RPC;
  }
};

export const setRpc = async (rpc: string) => {
  if (rpc === 'DEFAULT') {
    rpc = await getDefault();
  }
  client = new Client(rpc);
  hiveTx.config.node = rpc;
};

export const getClient = () => client;

export const transfer = async (key: string, obj: TransferOperation[1]) => {
  return await broadcast(key, [['transfer', obj]]);
};

export const recurrentTransfer = async (
  key: string,
  obj: RecurrentTransferOperation[1],
) => {
  return await broadcast(key, [['recurrent_transfer', obj]]);
};

export const broadcastJson = async (
  key: string,
  username: string,
  id: string,
  active: boolean,
  json: object | string,
) => {
  return await broadcast(key, [
    [
      'custom_json',
      {
        required_auths: active ? [username] : [],
        required_posting_auths: !active ? [username] : [],
        json: typeof json === 'object' ? JSON.stringify(json) : json,
        id,
      },
    ],
  ]);
};
//todo type obj
export const sendToken = async (key: string, username: string, obj: object) => {
  const result = (await broadcastJson(
    key,
    username,
    hiveEngine.CHAIN_ID,
    true,
    {
      contractName: 'tokens',
      contractAction: 'transfer',
      contractPayload: obj,
    },
  )) as BroadcastResult;
  return result;
};

export const powerUp = async (key: string, obj: object) => {
  return await broadcast(key, [['transfer_to_vesting', obj]]);
};

export const powerDown = async (key: string, obj: object) => {
  return await broadcast(key, [['withdraw_vesting', obj]]);
};

export const delegate = async (
  key: string,
  obj: DelegateVestingSharesOperation[1],
) => {
  return await broadcast(key, [['delegate_vesting_shares', obj]]);
};

export const convert = async (key: string, obj: ConvertOperation[1]) => {
  return await broadcast(key, [['convert', obj]]);
};

export const collateralizedConvert = async (
  key: string,
  obj: CollateralizedConvertOperation[1],
) => {
  return await broadcast(key, [['collateralized_convert', obj]]);
};

export const vote = async (key: string, obj: VoteOperation[1]) => {
  return await broadcast(key, [['vote', obj]]);
};

export const voteForWitness = async (
  key: string,
  obj: AccountWitnessVoteOperation[1],
) => {
  return await broadcast(key, [['account_witness_vote', obj]]);
};

export const setProxy = async (
  key: string,
  obj: AccountWitnessProxyOperation[1],
) => {
  return await broadcast(key, [['account_witness_proxy', obj]]);
};

export const post = async (
  key: string,
  {
    comment_options,
    username,
    parent_perm,
    parent_username,
    ...data
  }: RequestPost,
) => {
  const arr: Operation[] = [
    [
      'comment',
      {
        ...data,
        author: username,
        parent_permlink: parent_perm,
        parent_author: parent_username,
      },
    ],
  ];
  if (comment_options && comment_options.length) {
    arr.push([
      'comment_options',
      JSON.parse(comment_options) as CommentOptionsOperation[1],
    ]);
  }
  return await broadcast(key, arr);
};

export const signTx = (key: string, tx: object) => {
  const trx = new hiveTx.Transaction(tx);
  const signed = trx.sign(hiveTx.PrivateKey.from(key));
  return signed;
};

export const addAccountAuth = async (
  key: string,
  {
    username,
    authorizedUsername,
    role = KeychainKeyTypes.posting,
    weight,
  }: RequestAddAccountAuthority,
) => {
  const userAccount = (await getClient().database.getAccounts([username]))[0];

  const updatedAuthority =
    userAccount[role.toLowerCase() as 'posting' | 'active'];

  /** Release callback if the account already exist in the account_auths array */
  const authorizedAccounts = updatedAuthority.account_auths.map(
    (auth) => auth[0],
  );
  const hasAuthority = authorizedAccounts.indexOf(authorizedUsername) !== -1;
  if (hasAuthority) {
    throw new Error('Already has authority');
  }

  /** Use weight_thresold as default weight */
  weight =
    +weight ||
    userAccount[role.toLowerCase() as 'posting' | 'active'].weight_threshold;
  updatedAuthority.account_auths.push([authorizedUsername, weight]);
  const active =
    role === KeychainKeyTypes.active ? updatedAuthority : undefined;
  const posting =
    role === KeychainKeyTypes.posting ? updatedAuthority : undefined;

  /** Add authority on user account */
  return await accountUpdate(key, {
    account: userAccount.name,
    owner: undefined,
    active,
    posting,
    memo_key: userAccount.memo_key,
    json_metadata: userAccount.json_metadata,
  });
};

export const removeAccountAuth = async (
  key: string,
  {
    username,
    authorizedUsername,
    role = KeychainKeyTypes.posting,
  }: RequestRemoveAccountAuthority,
) => {
  const userAccount = (await getClient().database.getAccounts([username]))[0];

  const updatedAuthority =
    userAccount[role.toLowerCase() as 'posting' | 'active'];
  const totalAuthorizedUser = updatedAuthority.account_auths.length;
  for (let i = 0; i < totalAuthorizedUser; i++) {
    const user = updatedAuthority.account_auths[i];
    if (user[0] === authorizedUsername) {
      updatedAuthority.account_auths.splice(i, 1);
      break;
    }
  }

  /** Release callback if the account does not exist in the account_auths array */
  if (totalAuthorizedUser === updatedAuthority.account_auths.length) {
    throw new Error('Nothing to remove');
  }

  const active =
    role === KeychainKeyTypes.active ? updatedAuthority : undefined;
  const posting =
    role === KeychainKeyTypes.posting ? updatedAuthority : undefined;

  return await accountUpdate(key, {
    account: userAccount.name,
    owner: undefined,
    active,
    posting,
    memo_key: userAccount.memo_key,
    json_metadata: userAccount.json_metadata,
  });
};

export const addKeyAuth = async (
  key: string,
  {
    username,
    authorizedKey,
    role = KeychainKeyTypes.posting,
    weight,
  }: RequestAddKeyAuthority,
) => {
  const userAccount = (await getClient().database.getAccounts([username]))[0];
  const updatedAuthority =
    userAccount[role.toLowerCase() as 'posting' | 'active'];

  /** Release callback if the key already exist in the key_auths array */
  const authorizedKeys = updatedAuthority.key_auths.map((auth) => auth[0]);
  const hasAuthority = authorizedKeys.indexOf(authorizedKey) !== -1;
  if (hasAuthority) {
    throw new Error('already has authority');
  }

  /** Use weight_thresold as default weight */
  weight =
    weight ||
    userAccount[role.toLowerCase() as 'posting' | 'active'].weight_threshold;
  updatedAuthority.key_auths.push([authorizedKey, weight]);
  const active =
    role === KeychainKeyTypes.active ? updatedAuthority : undefined;
  const posting =
    role === KeychainKeyTypes.posting ? updatedAuthority : undefined;

  /** Add authority on user account */
  accountUpdate(key, {
    account: userAccount.name,
    owner: undefined,
    active,
    posting,
    memo_key: userAccount.memo_key,
    json_metadata: userAccount.json_metadata,
  });
};

export const removeKeyAuth = async (
  key: string,
  {
    username,
    authorizedKey,
    role = KeychainKeyTypes.posting,
  }: RequestRemoveKeyAuthority,
) => {
  const userAccount = (await getClient().database.getAccounts([username]))[0];

  const updatedAuthority =
    userAccount[role.toLowerCase() as 'posting' | 'active'];
  const totalAuthorizedKey = updatedAuthority.key_auths.length;
  for (let i = 0; i < totalAuthorizedKey; i++) {
    const user = updatedAuthority.key_auths[i];
    if (user[0] === authorizedKey) {
      updatedAuthority.key_auths.splice(i, 1);
      break;
    }
  }

  /** Release callback if the key does not exist in the key_auths array */
  if (totalAuthorizedKey === updatedAuthority.key_auths.length) {
    throw new Error('Missing authority');
  }

  const active =
    role === KeychainKeyTypes.active ? updatedAuthority : undefined;
  const posting =
    role === KeychainKeyTypes.posting ? updatedAuthority : undefined;

  accountUpdate(key, {
    account: userAccount.name,
    owner: undefined,
    active,
    posting,
    memo_key: userAccount.memo_key,
    json_metadata: userAccount.json_metadata,
  });
};

const accountUpdate = async (key: string, obj: AccountUpdateOperation[1]) => {
  return await broadcast(key, [['account_update', obj]]);
};

export const updateProposalVote = async (
  key: string,
  obj: UpdateProposalVotesOperation[1],
) => {
  return await broadcast(key, [['update_proposal_votes', obj]]);
};

export const broadcast = async (key: string, arr: Operation[]) => {
  console.log('got up to here', key);
  const tx = new hiveTx.Transaction();
  console.log(tx);
  await tx.create(arr);
  console.log('a', tx);
  console.log(hiveTx.PrivateKey.from(key));
  tx.sign(hiveTx.PrivateKey.from(key));
  console.log('signed : ', tx);
  try {
    const {error, result} = (await tx.broadcast()) as {
      error: Error;
      result: object;
    };
    if (error) {
      console.log(error);
      throw error;
    } else {
      return result;
    }
  } catch (e) {
    console.log(JSON.stringify(e));
    throw e;
  }
};

export default hive;
