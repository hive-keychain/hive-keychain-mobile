import hiveTx from 'hive-tx';
import {hiveEngine} from 'utils/config';

export const transfer = async (key, obj) => {
  return await broadcast(key, 'transfer', obj);
};

export const broadcastJson = async (key, username, id, active, json) => {
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

export const broadcast = async (key, type, obj) => {
  const tx = new hiveTx.Transaction();
  await tx.create([[type, obj]]);
  tx.sign(hiveTx.PrivateKey.from(key));
  const {error, result} = await tx.broadcast();
  if (error) {
    throw new Error(error.message);
  } else {
    return result;
  }
};
