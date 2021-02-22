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

export const broadcast = async (key, type, obj) => {
  const tx = new hiveTx.Transaction();
  await tx.create([[type, obj]]);
  tx.sign(hiveTx.PrivateKey.from(key));
  return (await tx.broadcast()).result;
};
