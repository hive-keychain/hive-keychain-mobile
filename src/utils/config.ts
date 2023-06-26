global.process = require('process');

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
        description: 'City simulation game based on hive-engine NFT tokens',
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
        name: 'dCrops',
        description: 'Farming simulator game built on the Hive blockchain',
        icon: 'https://images.hive.blog/u/dcrops/avatar',
        url: 'https://dcrops.com',
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
          'https://peakmonsters.com/static/favicons/apple-touch-icon-144x144.png',
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
      {
        name: 'Inji',
        description:
          'Your social platform for Crypto, NFTs, DeFi and the Metaverse.',
        icon: 'https://images.hive.blog/u/inji/avatar',
        url: 'https://inji.com',
        categories: ['social'],
      },
      {
        name: 'Splex.GG',
        description:
          'Maximize your RoA on idle cards while you do other things',
        icon:
          'https://splex.gg/assets/golem-fav-24a5326faa52366eb657a27defa761d8736fb602a865c356b27e5c1254a04444.png',
        url: 'https://splex.gg',
        categories: ['tool'],
      },
      {
        name: 'HiveHub',
        description: 'A block explorer for the Hive ecosystem',
        icon:
          'https://files.peakd.com/file/peakd-hive/theghost1980/23tbHLrpPr5Vr5HodaksVq3JbzsDJo7eA3vscTv65LYm15osgSspCWUx2qLTpj3t8usUU.png',
        url: 'https://hivehub.dev/market/',
        categories: ['finance', 'tool'],
      },
      {
        name: 'BeeSwap',
        description: 'Exchange your crypto in a fast & easy way',
        icon:
          'https://files.peakd.com/file/peakd-hive/theghost1980/AKJ58fKYro4jwSevzwc9rpQSWe2P5w72yPWY2kKqtSbwnk5b3zy2EAye2rwZG7k.png',
        url: 'https://beeswap.dcity.io/swap',
        categories: ['finance'],
      },
      {
        name: 'Reverio',
        description:
          'Ask and answer questions on Reverio and earn rewards for valuable contributions on $hive',
        icon: 'https://images.hive.blog/u/reverio/avatar',
        url: 'https://www.reverio.io/',
        categories: ['social', 'tool'],
      },
      {
        name: 'WOO',
        description:
          'Play-To-Earn business management game. Build your own wrestling organization',
        icon:
          'https://files.peakd.com/file/peakd-hive/theghost1980/AL1geTDPibhiR6soMiVAiLMoP9ymyNDf783WLXQCj71u42wj9C72R15ujEfVQxc.png',
        url: 'https://wrestlingorganizationonline.com/',
        categories: ['gaming', 'nft'],
      },
      {
        name: 'Kryptogamers',
        description:
          'Leading Provably Fair Hive Casino - Play 30+ games and earn daily dividends',
        icon: 'https://images.hive.blog/u/kryptogames/avatar',
        url: 'https://kryptogamers.com/',
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

//TODO Notes for bellow.
//10.0.1.5:5050 | localhost:5050
//having the device connected to the computer.
export const SwapsConfig = {
  autoRefreshPeriodSec: 30,
  autoRefreshHistoryPeriodSec: 10,
  baseURL:
    global.process.env.NODE_ENV === 'development'
      ? 'http://10.0.1.5:5050'
      : 'https://swap.hive-keychain.com',
};
