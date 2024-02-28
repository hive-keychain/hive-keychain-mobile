const hive = require('@hiveio/dhive');
import {
  AccountCreateOperation,
  AccountUpdateOperation,
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  CancelTransferFromSavingsOperation,
  ClaimRewardBalanceOperation,
  Client,
  CollateralizedConvertOperation,
  CommentOptionsOperation,
  ConvertOperation,
  CreateClaimedAccountOperation,
  CreateProposalOperation,
  DelegateVestingSharesOperation,
  Operation,
  RecurrentTransferOperation,
  RemoveProposalOperation,
  TransferFromSavingsOperation,
  TransferOperation,
  TransferToSavingsOperation,
  TransferToVestingOperation,
  UpdateProposalVotesOperation,
  VoteOperation,
} from '@hiveio/dhive';
import {Rpc} from 'actions/interfaces';
import api from 'api/keychain';
import hiveTx, {call} from 'hive-tx';
import {hiveEngine} from 'utils/config';
import {
  KeychainKeyTypes,
  KeychainKeyTypesLC,
  RequestAddAccountAuthority,
  RequestAddKeyAuthority,
  RequestPost,
  RequestRemoveAccountAuthority,
  RequestRemoveKeyAuthority,
} from './keychain.types';
import {useWorkingRPC} from './rpc-switcher.utils';

type BroadcastResult = {id: string};

export const DEFAULT_RPC = 'https://api.hive.blog';
const DEFAULT_CHAIN_ID =
  'beeab0de00000000000000000000000000000000000000000000000000000000';
let client = new Client(DEFAULT_RPC);
let testnet = false;

export const getDefault: () => Promise<string> = async () => {
  try {
    return (await api.get('/hive/rpc')).data.rpc;
  } catch (e) {
    return DEFAULT_RPC;
  }
};

export const setRpc = async (rpcObj: Rpc | string) => {
  let rpc = typeof rpcObj === 'string' ? rpcObj : rpcObj.uri;
  testnet = typeof rpcObj === 'string' ? false : rpcObj.testnet || false;
  if (rpc === 'DEFAULT') {
    rpc = await getDefault();
  }
  client = new Client(rpc);
  hiveTx.config.node = rpc;
  if (typeof rpcObj !== 'string') {
    //@ts-ignore
    client.chainId = Buffer.from(rpcObj.chainId || DEFAULT_CHAIN_ID);
    client.chainId.set(Buffer.from(rpcObj.chainId || DEFAULT_CHAIN_ID));
    hiveTx.config.chain_id = rpcObj.chainId || DEFAULT_CHAIN_ID;
  }
};

export const isTestnet = () => testnet;

export const getCurrency = (baseCurrency: 'HIVE' | 'HBD' | 'HP') => {
  switch (baseCurrency) {
    case 'HIVE':
      return testnet ? 'TESTS' : 'HIVE';
    case 'HBD':
      return testnet ? 'TBD' : 'HBD';
    case 'HP':
      return testnet ? 'TP' : 'HP';
  }
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

export const stakeToken = async (
  key: string,
  username: string,
  obj: object,
) => {
  const result = (await broadcastJson(
    key,
    username,
    hiveEngine.CHAIN_ID,
    true,
    {
      contractName: 'tokens',
      contractAction: 'stake',
      contractPayload: obj,
    },
  )) as BroadcastResult;
  return result;
};

export const unstakeToken = async (
  key: string,
  username: string,
  obj: object,
) => {
  const result = (await broadcastJson(
    key,
    username,
    hiveEngine.CHAIN_ID,
    true,
    {
      contractName: 'tokens',
      contractAction: 'unstake',
      contractPayload: obj,
    },
  )) as BroadcastResult;
  return result;
};

export const delegateToken = async (
  key: string,
  username: string,
  obj: object,
) => {
  const result = (await broadcastJson(
    key,
    username,
    hiveEngine.CHAIN_ID,
    true,
    {
      contractName: 'tokens',
      contractAction: 'delegate',
      contractPayload: obj,
    },
  )) as BroadcastResult;
  return result;
};

export const cancelDelegateToken = async (
  key: string,
  username: string,
  obj: object,
) => {
  const result = (await broadcastJson(
    key,
    username,
    hiveEngine.CHAIN_ID,
    true,
    {
      contractName: 'tokens',
      contractAction: 'undelegate',
      contractPayload: obj,
    },
  )) as BroadcastResult;
  return result;
};

export const powerUp = async (
  key: string,
  obj: TransferToVestingOperation[1],
) => {
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

export const depositToSavings = async (
  key: string,
  obj: TransferToSavingsOperation[1],
) => {
  return await broadcast(key, [['transfer_to_savings', obj]]);
};

export const withdrawFromSavings = async (
  key: string,
  obj: TransferFromSavingsOperation[1],
) => {
  return await broadcast(key, [['transfer_from_savings', obj]]);
};

export const cancelPendingSavings = async (
  key: string,
  obj: CancelTransferFromSavingsOperation[1],
) => {
  return await broadcast(key, [['cancel_transfer_from_savings', obj]]);
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

export const createClaimedAccount = async (
  key: string,
  obj: CreateClaimedAccountOperation[1],
) => {
  return await broadcast(key, [['create_claimed_account', obj]]);
};

export const createNewAccount = async (
  key: string,
  obj: AccountCreateOperation[1],
) => {
  return await broadcast(key, [['account_create', obj]]);
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
  const roleLC = role.toLowerCase() as KeychainKeyTypesLC;
  const updatedAuthority = userAccount[roleLC as 'posting' | 'active'];

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
    weight || userAccount[roleLC as 'posting' | 'active'].weight_threshold;
  updatedAuthority.account_auths.push([authorizedUsername, +weight]);
  updatedAuthority.account_auths.sort((a, b) => a[0].localeCompare(b[0]));

  const active =
    roleLC === KeychainKeyTypesLC.active
      ? updatedAuthority
      : userAccount.active;
  const posting =
    roleLC === KeychainKeyTypesLC.posting
      ? updatedAuthority
      : userAccount.posting;

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
  const roleLC = role.toLowerCase() as KeychainKeyTypesLC;
  const updatedAuthority = userAccount[roleLC as 'posting' | 'active'];
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
    roleLC === KeychainKeyTypesLC.active ? updatedAuthority : undefined;
  const posting =
    roleLC === KeychainKeyTypesLC.posting ? updatedAuthority : undefined;

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
  const roleLC = role.toLowerCase() as KeychainKeyTypesLC;

  const userAccount = (await getClient().database.getAccounts([username]))[0];
  const updatedAuthority = userAccount[roleLC as 'posting' | 'active'];

  /** Release callback if the key already exist in the key_auths array */
  const authorizedKeys = updatedAuthority.key_auths.map((auth) => auth[0]);
  const hasAuthority = authorizedKeys.indexOf(authorizedKey) !== -1;
  if (hasAuthority) {
    throw new Error('already has authority');
  }

  /** Use weight_thresold as default weight */
  weight =
    weight || userAccount[roleLC as 'posting' | 'active'].weight_threshold;
  updatedAuthority.key_auths.push([authorizedKey, +weight]);
  updatedAuthority.key_auths.sort((a, b) =>
    (a[0] as string).localeCompare(b[0] as string),
  );

  const active =
    roleLC === KeychainKeyTypesLC.active ? updatedAuthority : undefined;
  const posting =
    roleLC === KeychainKeyTypesLC.posting ? updatedAuthority : undefined;

  /** Add authority on user account */
  return accountUpdate(key, {
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
  const roleLC = role.toLowerCase() as KeychainKeyTypesLC;

  const updatedAuthority = userAccount[roleLC as 'posting' | 'active'];
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
    roleLC === KeychainKeyTypesLC.active ? updatedAuthority : undefined;
  const posting =
    roleLC === KeychainKeyTypesLC.posting ? updatedAuthority : undefined;

  return accountUpdate(key, {
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

export const createProposal = async (
  key: string,
  obj: CreateProposalOperation[1],
) => {
  return await broadcast(key, [['create_proposal', obj]]);
};

export const claimRewards = async (
  key: string,
  obj: ClaimRewardBalanceOperation[1],
) => {
  return await broadcast(key, [['claim_reward_balance', obj]]);
};

export const removeProposal = async (
  key: string,
  obj: RemoveProposalOperation[1],
) => {
  return await broadcast(key, [['remove_proposal', obj]]);
};

export const broadcast = async (key: string, arr: Operation[]) => {
  const tx = new hiveTx.Transaction();
  await tx.create(arr);
  tx.sign(hiveTx.PrivateKey.from(key));
  try {
    const broadcast = await tx.broadcast();
    const {error, result} = broadcast as {
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
    console.log('hive-tx error', JSON.stringify(e));
    throw e;
  }
};

export const getData = async (
  method: string,
  params: any[] | object,
  key?: string,
) => {
  const response = await call(method, params);
  if (response?.result) {
    return key ? response.result[key] : response.result;
  } else useWorkingRPC();
  throw new Error(
    `Error while retrieving data from ${method} : ${JSON.stringify(
      response.error,
    )}`,
  );
};

export default hive;
