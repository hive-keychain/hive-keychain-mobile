global.process = require('process');
export const hiveEngineWebsiteURL = 'https://hive-engine.com/';

export const hiveEngine = {
  CHAIN_ID: 'ssc-mainnet-hive',
};

export const hiveConfig = {
  CREATE_ACCOUNT_URL: 'https://signup.hive.io/',
};

export const HASConfig = {
  protocol: 'has://',
  auth_req: 'has://auth_req/',
  socket: 'wss://hive-auth.arcange.eu',
};

export const TransakConfig = {
  apiKey: '716078e4-939c-445a-8c6d-534614cd31b1',
};

export type DApp = {
  name: string;
  description: string;
  icon: string;
  url: string;
  appendUsername?: boolean;
  categories: string[];
};

export const BrowserConfig = {
  HOMEPAGE_URL: 'about:blank',
  FOOTER_HEIGHT: 40,
  HEADER_HEIGHT: 45,
};

export const KeychainConfig = {
  NO_USERNAME_TYPES: [
    'delegation',
    'witnessVote',
    'proxy',
    'custom',
    'signBuffer',
    'transfer',
  ],
};

export const WitnessesConfig = {
  feedWarningLimitInHours: 5,
};

export const SwapsConfig = {
  autoRefreshPeriodSec: +(process.env.DEV_SWAP_AUTO_REFRESH ?? 30),
  autoRefreshHistoryPeriodSec: +(process.env.DEV_SWAP_AUTO_REFRESH ?? 10),
  baseURL:
    process.env.KEYCHAIN_SWAP_API_DEV === 'true'
      ? 'http://localhost:5050'
      : 'https://swap.hive-keychain.com',
};

export const ClaimsConfig = {
  FREQUENCY: 10,
  freeAccount: {
    MIN_RC_PCT: 85,
    MIN_RC: 9484331370472,
  },
  savings: {
    delay: 30,
  },
};
