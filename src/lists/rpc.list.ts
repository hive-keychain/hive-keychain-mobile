import {Rpc} from 'actions/interfaces';

export const DEFAULT_RPC: Rpc = {uri: 'https://api.hive.blog', testnet: false};

export const rpcList: Rpc[] = [
  DEFAULT_RPC,
  {uri: 'https://api.deathwing.me', testnet: false},
  {uri: 'https://api.openhive.network', testnet: false},
  {uri: 'https://anyx.io', testnet: false},
  {uri: 'https://api.pharesim.me', testnet: false},
  {uri: 'https://hived.emre.sh', testnet: false},
  {uri: 'https://rpc.ausbit.dev', testnet: false},
  {uri: 'https://rpc.ecency.com', testnet: false},
  {uri: 'https://techcoderx.com', testnet: false},
  {uri: 'https://hive-api.arcange.eu', testnet: false},
  {
    uri: 'https://testnet.openhive.network',
    testnet: true,
    chainId: '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e',
  },
];
