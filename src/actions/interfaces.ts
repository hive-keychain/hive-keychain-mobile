import {VestingDelegation} from '@hiveio/dhive';

export interface actionPayload<T> {
  readonly type: string;
  readonly payload?: T;
}

export interface lastAccount {
  has: boolean;
  name?: string;
}

export type nullableString = string | null;

export interface auth {
  mk: nullableString;
}

export interface settings {
  rpc: string;
}

export interface history {
  url: string;
  name: string;
  icon: string;
}

export interface tab {
  id: number;
  url: string;
  name?: string;
  icon?: string;
  image?: string;
}

export interface browserPayload {
  url?: string;
  history?: history;
  shouldFocus?: boolean;
  id?: number | null;
  data?: tab;
  showManagement?: boolean;
  whitelist?: [];
}

export interface browser {
  history: history[];
  whitelist: [];
  tabs: tab[];
  activeTab: number | null;
  shouldFocus: boolean;
  showManagement: boolean;
}

export interface transaction {
  key: string;
  amount: string;
  from: string;
  memo: string;
  timestamp: string;
  to: string;
  type: string;
}

export interface transactions {
  loading: boolean;
  list: [transaction?];
}

export interface token {
  circulatingSupply: string;
  delegationEnabled: boolean;
  issuer: string;
  maxSupply: string;
  metadata: string;
  name: string;
  numberTransactions: number;
  precision: number;
  stakingEnabled: boolean;
  supply: string;
  symbol: string;
  totalStaked: string;
  undelegationCooldown: number;
  unstakingCooldown: number;
}

export interface tokenMarket {
  highestBid: string;
  lastDayPrice: string;
  lastDayPriceExpiration: number;
  lastPrice: string;
  lowestAsk: string;
  priceChangeHive: string;
  priceChangePercent: string;
  symbol: string;
  volume: string;
  volumeExpiration: number;
  _id: number;
}

export interface tokenBalance {
  account: string;
  balance: string;
  delegationsIn: string;
  delegationsOut: string;
  pendingUndelegations: string;
  pendingUnstake: string;
  stake: string;
  symbol: string;
  _id: number;
}

export interface userTokens {
  loading: boolean;
  list: [tokenBalance?];
}

export enum operationsHE {
  'mining_lottery',
  'tokens_transfer',
  'tokens_stake',
}
export interface tokenTransaction {
  account: string;
  amount: string;
  blockNumber: number;
  operation: operationsHE;
  poolId?: string;
  from?: string;
  to?: string;
  memo?: string;
  quantity: string;
  symbol: string;
  timestamp: number;
  transactionId: string;
  _id: string;
}

export interface incomingDelegation {
  delegation_date: string;
  delegator: string;
  vesting_shares: number;
}
export interface delegations {
  incoming: [incomingDelegation?];
  outgoing: [VestingDelegation?];
}
export interface delegationsPayload {
  incoming?: [incomingDelegation?];
  outgoing?: [VestingDelegation?];
}

export interface conversion {
  amount: string;
  conversion_date: string;
  id: number;
  owner: string;
  requestid: number;
}

interface btc {
  Bid: number;
  Daily: string;
  PrevDay: number;
}

interface currency extends btc {
  DailyUsd: string;
  Usd: string;
}

export interface bittrex {
  btc: btc | {};
  hive: currency | {};
  hbd: currency | {};
}

export interface accountKeys {
  posting?: string;
  active?: string;
  memo?: string;
  postingPubkey?: string;
  activePubkey?: string;
  memoPubkey?: string;
}
export interface account {
  name: string;
  keys: accountKeys;
}
