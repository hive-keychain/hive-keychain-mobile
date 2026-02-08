import {Rpc} from 'actions/interfaces';

export const DEFAULT_RPC: Rpc = {uri: 'https://api.hive.blog', testnet: false};

export const rpcList: Rpc[] = [
  DEFAULT_RPC,
  {uri: 'https://api.deathwing.me', testnet: false},
  {uri: 'https://api.openhive.network', testnet: false},
  {uri: 'https://hive-api.3speak.tv', testnet: false},
  {uri: 'https://hiveapi.actifit.io', testnet: false},
  {uri: 'https://techcoderx.com', testnet: false},
  {uri: 'https://api.c0ff33a.uk', testnet: false},
  {uri: 'https://hive.roelandp.nl', testnet: false},
  {
    uri: 'https://testnet.openhive.network',
    testnet: true,
    chainId: '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e',
  },
];
