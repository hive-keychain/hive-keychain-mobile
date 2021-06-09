export interface actionPayload<T> {
  type: string;
  payload: T;
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

interface history {
  url: string;
  name: string;
  icon: string;
}

interface tab {
  id: number;
  url: string;
  name?: string;
  icon?: string;
  image?: string;
}
export type browserPayload = any;

export interface browser {
  history: [history?];
  whitelist: [];
  tabs: [tab?];
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
