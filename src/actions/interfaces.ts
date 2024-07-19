import {
  DynamicGlobalProperties,
  ExtendedAccount,
  Price,
  VestingDelegation,
} from '@hiveio/dhive';
import {Manabar} from '@hiveio/dhive/lib/chain/rc';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {RcDelegationsInfo} from '../interfaces/rc-delegation.interface';

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

export interface Rpc {
  uri: string;
  testnet?: boolean;
  chainId?: string;
}
export interface Settings {
  rpc: Rpc;
  hiveEngineRpc: string;
  accountHistoryAPIRpc: string;
}

export interface SettingsPayload {
  rpc?: Rpc;
  hiveEngineRpc?: string;
  accountHistoryAPIRpc?: string;
}

export interface Page {
  url: string;
  name?: string;
  icon?: string;
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
  history?: Page;
  shouldFocus?: boolean;
  id?: number | null;
  data?: TabFields;
  showManagement?: boolean;
  favorite?: Page;
}

export interface Browser {
  history: Page[];
  favorites: Page[];
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

export type CollateralizedConversion = {
  collateral_amount: string;
  conversion_date: string;
  owner: string;
  id: number;
  requestid: number;
};

export interface Currency {
  usd_24h_change?: number;
  usd?: number;
}

export interface CurrencyPrices {
  bitcoin: Currency;
  hive: Currency;
  hive_dollar: Currency;
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

export interface MessageModalPayload {
  key: string;
  type: MessageModalType;
  params?: {};
  skipTranslation?: boolean;
}

export interface FloatingBarPayload {
  show: boolean;
  isLoadingScreen: boolean;
  isDrawerOpened: boolean;
  isProposalRequestDisplayed: boolean;
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

export type RC = Manabar & RcDelegationsInfo;

export interface ActiveAccount {
  account: ExtendedAccount;
  keys: AccountKeys;
  rc: RC;
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

export interface Witness {
  name: string;
  rank?: string;
  active_rank?: string;
  votes?: number;
  votes_count?: number;
  signing_key?: string;
  url?: string;
}
