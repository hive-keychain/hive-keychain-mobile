const hive = require('@hiveio/dhive');
import {
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  Client,
  ConvertOperation,
  DelegateVestingSharesOperation,
  TransferOperation,
  UpdateProposalVotesOperation,
  VoteOperation,
} from '@hiveio/dhive';
import api from 'api/keychain';
import hiveTx from 'hive-tx';
import {hiveEngine} from 'utils/config';

type BroadcastResult = {id: string};

const DEFAULT_RPC = 'https://api.hive.blog';
let client = new Client(DEFAULT_RPC);

hiveTx.config.rebranded_api = true;
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

export const broadcastJson = async (
  key: string,
  username: string,
  id: string,
  active: boolean,
  json: object,
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
  {comment_options, username, parent_perm, parent_username, ...data}: object,
) => {
  const arr = [
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
    arr.push(['comment_options', JSON.parse(comment_options)]);
  }
  return await broadcast(key, arr);
};

export const signTx = (key: string, tx: object) => {
  const trx = new hiveTx.Transaction(tx);
  const signed = trx.sign(hiveTx.PrivateKey.from(key));
  return signed;
};

export const updateProposalVote = async (
  key: string,
  obj: UpdateProposalVotesOperation,
) => {
  return await broadcast(key, [['update_proposal_votes', obj]]);
};

export const broadcast = async (key: string, arr: any[]) => {
  const tx = new hiveTx.Transaction();
  await tx.create(arr);
  tx.sign(hiveTx.PrivateKey.from(key));

  const {error, result} = (await tx.broadcast()) as {
    error: Error;
    result: object;
  };
  if (error) {
    throw error;
  } else {
    return result;
  }
};
export default hive;
