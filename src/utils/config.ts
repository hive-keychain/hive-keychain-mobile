global.process = require('process');
export const hiveEngineWebsiteURL = 'https://hive-engine.com/';
export const tutorialBaseUrl =
  process.env.DEV_TUTORIAL ?? 'https://tutorial.hive-keychain.com';

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
  mobileUrl?: string;
  categories: string[];
};

export const BrowserConfig = {
  HOMEPAGE_URL: 'about:blank',
  FOOTER_HEIGHT: 40,
  HEADER_HEIGHT: 45,
  EDGE_THRESHOLD: 30,
  HOMEPAGE_FAVICON: 'https://hive-keychain.com/favicon.png',
};

export const KeychainConfig = {
  ANONYMOUS_REQUESTS: [
    'delegation',
    'witnessVote',
    'proxy',
    'custom',
    'signBuffer',
    'transfer',
    'recurrentTransfer',
  ],
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
  autoStakeTokens: {FREQUENCY: 60},
};

export const MultisigConfig = {
  baseURL:
    process.env.MULTISIG_BACKEND_SERVER ||
    'https://api-multisig.hive-keychain.com',
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

export const ProposalConfig = {
  KEYCHAIN_PROPOSAL: 341,
  PROPOSAL_MIN_VOTE_DIFFERENCE_HIDE_POPUP: 8 * 10 ** 6,
};

export const PeakdNotificationsConfig = {
  baseURL: 'https://notifications.hivehub.dev',
};

export const VSCConfig = {
  ID: 'vsc.tx',
  ACCOUNT: 'vsc.gateway',
  BLOCK_EXPLORER: 'https://vsc.techcoderx.com',
  API_URL: 'https://api.vsc.eco/api/v1/graphql',
  BASE_JSON: {
    net_id: 'vsc-mainnet',
  },
};
