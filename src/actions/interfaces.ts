import {
  DynamicGlobalProperties,
  ExtendedAccount,
  Price,
  VestingDelegation,
} from '@hiveio/dhive';
import {Manabar} from '@hiveio/dhive/lib/chain/rc';

export interface ActionPayload<T> {
  readonly type: string;
  readonly payload?: T;
}

export interface LastAccount {
  has: boolean;
  name?: string;
}

export type NullableString = string | null;

export interface Auth {
  mk: NullableString;
}

export interface Settings {
  rpc: string;
}

export interface SettingsPayload {
  rpc?: string;
}

export interface History {
  url: string;
  name: string;
  icon: string;
}

export interface Tab {
  id: number;
  url: string;
  name?: string;
  icon?: string;
  image?: string;
}

export interface TabFields {
  id?: number;
  url?: string;
  name?: string;
  icon?: string;
  image?: string;
}

export interface BrowserPayload {
  url?: string;
  history?: History;
  shouldFocus?: boolean;
  id?: number | null;
  data?: TabFields;
  showManagement?: boolean;
  whitelist?: [];
}

export interface Browser {
  history: History[];
  whitelist: [];
  tabs: Tab[];
  activeTab: number | null;
  shouldFocus: boolean;
  showManagement: boolean;
}

export interface Transaction {
  key: string;
  amount: string;
  from: string;
  memo: string;
  timestamp: string;
  to: string;
  type: string;
  last?: boolean;
}

export interface Transactions {
  loading: boolean;
  list: Transaction[];
}

export interface Token {
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

export interface TokenMarket {
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

export interface TokenBalance {
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

export interface UserTokens {
  loading: boolean;
  list: TokenBalance[];
}

export enum OperationsHiveEngine {
  'mining_lottery',
  'tokens_transfer',
  'tokens_stake',
}
export interface TokenTransaction {
  account: string;
  amount: string;
  blockNumber: number;
  operation: OperationsHiveEngine;
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

export interface IncomingDelegation {
  delegation_date: string;
  delegator: string;
  vesting_shares: number;
}
export interface Delegations {
  incoming: IncomingDelegation[];
  outgoing: VestingDelegation[];
}
export interface DelegationsPayload {
  incoming?: IncomingDelegation[];
  outgoing?: VestingDelegation[];
}
export interface Delegator {
  delegator: string;
  vesting_shares: number;
  delegation_date: string;
}
export interface Conversion {
  amount: string;
  conversion_date: string;
  id: number;
  owner: string;
  requestid: number;
}

interface Btc {
  Bid?: number;
  Daily?: string;
  PrevDay?: number;
}

export interface Currency extends Btc {
  DailyUsd?: string;
  Usd?: string;
}

export interface Bittrex {
  btc: Btc;
  hive: Currency;
  hbd: Currency;
}

export interface AccountKeys {
  posting?: string;
  active?: string;
  memo?: string;
  postingPubkey?: string;
  activePubkey?: string;
  memoPubkey?: string;
}
export interface Account {
  name: string;
  keys: AccountKeys;
}

export interface AccountsPayload {
  account?: Account;
  accounts?: Account[];
  name?: string;
}
export enum KeyTypes {
  posting = 'posting',
  active = 'active',
  memo = 'memo',
}

export enum PubKeyTypes {
  posting = 'postingPubkey',
  active = 'activePubkey',
  memo = 'memoPubkey',
}

export interface ActiveAccount {
  account: ExtendedAccount;
  keys: AccountKeys;
  rc: Manabar;
  name?: string;
}

export interface RewardFund {
  author_reward_curve: string;
  content_constant: string;
  curation_reward_curve: string;
  id: number;
  last_update: string;
  name: string;
  percent_content_rewards: number;
  percent_curation_rewards: number;
  recent_claims: string;
  reward_balance: string;
}
export interface GlobalProperties {
  globals?: DynamicGlobalProperties;
  price?: Price;
  rewardFund?: RewardFund;
}


