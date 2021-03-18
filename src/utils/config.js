export const hiveEngine = {
  CHAIN_ID: 'ssc-mainnet-hive',
};

export const hiveConfig = {
  CREATE_ACCOUNT_URL: 'https://signup.hive.io/',
};
export const BrowserConfig = {
  HOMEPAGE_URL:
    process.env.NODE_ENV === 'development'
      ? 'http://192.168.0.102:1337/example/main.html'
      : 'https://hive.io',
  FOOTER_HEIGHT: 40,
  HEADER_HEIGHT: 40,
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
