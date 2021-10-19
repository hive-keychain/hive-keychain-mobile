export const hiveEngine = {
  CHAIN_ID: 'ssc-mainnet-hive',
};

export const hiveConfig = {
  CREATE_ACCOUNT_URL: 'https://signup.hive.io/',
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
  HomeTab: {
    categories: [
      {title: 'finance', color: '#2A5320', logo: ''},
      {title: 'social', color: '#215858', logo: ''},
      // {title: 'video', color: '#2A435C', logo: ''},
      {title: 'gaming', color: '#6A3434', logo: ''},
      {title: 'nft', color: '#6F3D71', logo: ''},
      {title: 'tool', color: '#353E3E', logo: ''},
    ],
    dApps: [
      {
        name: 'Splinterlands',
        description: 'Collect, Trade, Battle!',
        icon: 'https://images.hive.blog/u/splinterlands/avatar',
        url: 'https://m.splinterlands.io',
        categories: ['gaming', 'nft'],
      },
      {
        name: 'PeakD',
        description: 'Decentralized Social Media with True Ownership',
        icon: 'https://images.hive.blog/u/peakd/avatar',
        url: 'https://peakd.com',
        categories: ['social'],
      },
      {
        name: 'Hive.blog',
        description: 'Community interface for Hive',
        icon: 'https://images.hive.blog/u/hiveio/avatar',
        url: 'https://hive.blog',
        categories: ['social'],
      },
      {
        name: 'Hive Market',
        description: 'Internal Hive/HBD exchange',
        icon: 'https://images.hive.blog/u/hiveio/avatar',
        url: 'https://wallet.hive.blog/market',
        categories: ['finance'],
      },
      {
        name: 'CryptoBrewMaster',
        description: 'Brew - Study - Trade',
        icon: 'https://images.hive.blog/u/cryptobrewmaster/avatar',
        url: 'http://cryptobrewmaster.io',
        categories: ['gaming'],
      },
      {
        name: 'dCity',
        description: 'City simulation game based on hive-engine NFT tokens.',
        icon: 'https://images.hive.blog/u/dcitygame/avatar',
        url: 'https://dcity.io',
        categories: ['gaming', 'nft'],
      },
      {
        name: 'Rabona',
        description: 'Soccer Manager on the blockchain',
        icon: 'https://images.hive.blog/u/rabona/avatar',
        url: 'https://rabona.io/',
        categories: ['gaming'],
      },
      {
        name: 'Hive-Engine',
        description: 'Create Tokens & Smart Contracts on Hive.',
        icon: 'https://avatars.githubusercontent.com/u/51540775?s=200&v=4',
        url: 'https://hive-engine.com/',
        categories: ['finance'],
      },
      {
        name: 'Tribaldex',
        description: 'Create Tokens & Smart Contracts on Hive.',
        icon:
          'https://files.peakd.com/file/peakd-hive/keychain/48Z7YEkS64Tj1TE4cKoDNQFwWYXoUPthPp8anZLgLM3kEMS5VkKaB8LuNKzVBmV6u6.png',
        url: 'https://tribaldex.com/',
        categories: ['finance'],
      },
      // {
      //   name: 'LeoFinance',
      //   description: 'Crypto & Finance Blogging Platform',
      //   icon: 'https://images.hive.blog/u/steem.leo/avatar',
      //   url: 'https://leofinance.io/',
      //   categories: ['social', 'finance'],
      // }, //Dont support keychain login for now
      {
        name: 'NFT Showroom',
        description: 'Digital Art Marketplace',
        icon: 'https://images.hive.blog/u/nftshowroom/avatar',
        url: 'https://nftshowroom.com/',
        categories: ['nft'],
      },
      {
        name: 'HiveStats',
        description: 'Track & Analyze Your Hive Blockchain Account',
        icon: 'https://images.hive.blog/u/steem.leo/avatar',
        url: 'https://hivestats.io/@',
        appendUsername: true,
        categories: ['tool'],
      },
      {
        name: 'HiveBlocks',
        description: 'Block Explorer',
        icon: 'https://hiveblocks.com/images/logo-hive.png',
        url: 'https://hiveblocks.com/@',
        appendUsername: true,
        categories: ['tool'],
      },
      {
        name: 'D.Buzz',
        description: 'Micro-Blogging Platform',
        icon: 'https://images.hive.blog/u/dbuzz/avatar',
        url: 'https://d.buzz/',
        categories: ['social'],
      },
      {
        name: 'LeoDex',
        description: 'Alternative Hive-Engine interface',
        icon: 'https://images.hive.blog/u/leodex/avatar',
        url: 'https://leodex.io/',
        categories: ['finance'],
      },
      {
        name: 'Sports Talk Social',
        description: 'Rewarded Sports Media Platform',
        icon: 'https://images.hive.blog/u/sportstalksocial/avatar',
        url: 'https://www.sportstalksocial.com/',
        categories: ['social'],
      },
      {
        name: 'Peakmonsters',
        description: 'Fast / Easy / Informative tools for Splinterlands',
        icon:
          'https://peakmonsters.com/static/favicons/favicon-196x196.png?v=2',
        url: 'https://peakmonsters.com/',
        categories: ['gaming', 'tool'],
      },
      {
        name: 'Exode',
        description: 'Explore. Colonize. Earn Crypto',
        icon: 'https://exode.io/graphics/pics/favicon_blue.png',
        url: 'https://exode.io/',
        categories: ['gaming'],
      },
      {
        name: 'Rising Star',
        description:
          'Start as a lowly busker and work your way up to a global mega star!',
        icon: 'https://images.hive.blog/u/risingstargame/avatar',
        url: 'https://risingstargame.com',
        categories: ['gaming'],
      },
    ],
  },
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
