export interface HiveEngineConfig {
  rpc: string;
  mainnet: string;
  accountHistoryApi: string;
}

export const DEFAULT_HIVE_ENGINE_RPCS = [
  'https://api.hive-engine.com/rpc',
  'https://herpc.dtools.dev',
  'https://api.primersion.com',
  'https://ha.herpc.dtools.dev',
  'https://api2.hive-engine.com/rpc',
  'https://he.atexoras.com:2083',
];

export const DEFAULT_ACCOUNT_HISTORY_RPCS = [
  'https://accounts.hive-engine.com/accountHistory',
  'https://history.hive-engine.com',
  'https://he.atexoras.com:8443',
];

export const DEFAULT_CUSTOM_RPC = {
  uri: '',
  testnet: false,
  hiveEngine: false,
};

export const DEFAULT_HE_RPC_NODE = 'https://api.hive-engine.com/rpc';

export const DEFAULT_ACCOUNT_HISTORY_RPC_NODE =
  'https://history.hive-engine.com/';
