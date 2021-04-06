import hiveTx from 'hive-tx';
import api from 'api/keychain';
import {hiveEngine} from 'utils/config';

let hive = require('@hiveio/dhive');
const DEFAULT_RPC = 'https://api.hive.blog';

let client = new hive.Client(DEFAULT_RPC);

const getDefault = async () => {
  try {
    return (await api.get('/hive/rpc')).data.rpc;
  } catch (e) {
    return DEFAULT_RPC;
  }
};

export const setRpc = async (rpc) => {
  if (rpc === 'DEFAULT') {
    rpc = await getDefault();
  }
  client = new hive.Client(rpc);
  hiveTx.config.node = rpc;
};

export const getClient = () => client;

export const transfer = async (key, obj) => {
  return await broadcast(key, [['transfer', obj]]);
};

export const broadcastJson = async (key, username, id, active, json) => {
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

export const sendToken = async (key, username, obj) => {
  return await broadcastJson(key, username, hiveEngine.CHAIN_ID, true, {
    contractName: 'tokens',
    contractAction: 'transfer',
    contractPayload: obj,
  });
};

export const powerUp = async (key, obj) => {
  return await broadcast(key, [['transfer_to_vesting', obj]]);
};

export const powerDown = async (key, obj) => {
  return await broadcast(key, [['withdraw_vesting', obj]]);
};

export const delegate = async (key, obj) => {
  return await broadcast(key, [['delegate_vesting_shares', obj]]);
};

export const convert = async (key, obj) => {
  return await broadcast(key, [['convert', obj]]);
};

export const vote = async (key, obj) => {
  return await broadcast(key, [['vote', obj]]);
};

export const post = async (
  key,
  {comment_options, username, parent_perm, parent_username, ...data}: obj,
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

export const broadcast = async (key, arr) => {
  const tx = new hiveTx.Transaction();
  console.log(arr);
  await tx.create(arr);
  tx.sign(hiveTx.PrivateKey.from(key));
  const {error, result} = await tx.broadcast();
  if (error) {
    throw error;
  } else {
    return result;
  }
};

export default hive;
