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
  return await broadcast(key, 'transfer', obj);
};

export const broadcastJson = async (key, username, id, active, json) => {
  console.log(key, 'custom_json', {
    required_auths: active ? [username] : [],
    required_posting_auths: !active ? [username] : [],
    json: typeof json === 'object' ? JSON.stringify(json) : json,
    id,
  });
  return await broadcast(key, 'custom_json', {
    required_auths: active ? [username] : [],
    required_posting_auths: !active ? [username] : [],
    json: typeof json === 'object' ? JSON.stringify(json) : json,
    id,
  });
};

export const sendToken = async (key, username, obj) => {
  return await broadcastJson(key, username, hiveEngine.CHAIN_ID, true, {
    contractName: 'tokens',
    contractAction: 'transfer',
    contractPayload: obj,
  });
};

export const powerUp = async (key, obj) => {
  return await broadcast(key, 'transfer_to_vesting', obj);
};

export const powerDown = async (key, obj) => {
  return await broadcast(key, 'withdraw_vesting', obj);
};

export const delegate = async (key, obj) => {
  return await broadcast(key, 'delegate_vesting_shares', obj);
};

export const convert = async (key, obj) => {
  return await broadcast(key, 'convert', obj);
};

export const vote = async (key, obj) => {
  console.log(key, obj);
  return await broadcast(key, 'vote', obj);
};

export const broadcast = async (key, type, obj) => {
  const tx = new hiveTx.Transaction();
  await tx.create([[type, obj]]);
  tx.sign(hiveTx.PrivateKey.from(key));
  const {error, result} = await tx.broadcast();
  if (error) {
    throw error;
  } else {
    return result;
  }
};

export default hive;
