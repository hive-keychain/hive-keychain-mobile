import {TokenBalance} from 'actions/interfaces';
import testAccount from './test-account';

const {name: username} = testAccount._default;

const balance = [
  {
    _id: 13429,
    account: username,
    symbol: 'LEO',
    balance: '38.861',
    stake: '1.060',
    pendingUnstake: '0',
    delegationsIn: '1',
    delegationsOut: '1',
    pendingUndelegations: '0',
  },
  {
    _id: 10000,
    account: username,
    symbol: 'SWAP.HIVE',
    balance: '38000.861',
    stake: '1000.060',
    pendingUnstake: '0',
    delegationsIn: '1',
    delegationsOut: '1',
    pendingUndelegations: '0',
  },
  {
    _id: 115171,
    account: username,
    symbol: 'BUILDTEAM',
    balance: '100',
    stake: '38.87982783',
    pendingUnstake: '0',
    delegationsIn: '0',
    delegationsOut: '0',
    pendingUndelegations: '0',
  },
  {
    _id: 71441,
    account: username,
    symbol: 'PAL',
    balance: '1189.573',
    stake: '702.466',
    pendingUnstake: '0',
    delegationsIn: '0',
    delegationsOut: '0',
    pendingUndelegations: '0',
  },
] as TokenBalance[];

const notInMarket = {
  _id: 99999,
  account: username,
  symbol: 'KEYCHAIN',
  balance: '11890.573',
  stake: '702000.466',
  pendingUnstake: '0',
  delegationsIn: '0',
  delegationsOut: '0',
  pendingUndelegations: '0',
} as TokenBalance;
//TODO commented as may be possible feature in future?
// const incomingDelegations = [
//   {
//     from: 'theghost1980',
//     quantity: '100',
//     symbol: 'LEO',
//     to: username,
//     created: 1657742138,
//     updated: 1657742138,
//   },
// ] as TokenDelegation[];

// const outcomingDelegations = [
//   {
//     from: username,
//     quantity: '200',
//     symbol: 'LEO',
//     to: 'cedricguillas',
//     created: 1657742138,
//     updated: 1657742138,
//   },
// ] as TokenDelegation[];

export default {balance, notInMarket};
