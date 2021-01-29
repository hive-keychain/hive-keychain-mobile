import api from 'api/keychain';
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
};

export const getClient = () => client;

export default hive;
