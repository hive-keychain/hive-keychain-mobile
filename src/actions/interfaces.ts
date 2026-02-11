import {
  DynamicGlobalProperties,
  ExtendedAccount,
  Price,
  VestingDelegation,
} from '@hiveio/dhive';
import {Manabar} from '@hiveio/dhive/lib/chain/rc';
import {PlatformOSType} from 'react-native';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {RcDelegationsInfo} from '../interfaces/rcDelegation.interface';

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
  ignoreNextBiometrics?: boolean;
}

export interface Rpc {
  uri: string;
  testnet?: boolean;
  chainId?: string;
}
export interface Settings {
  rpc: Rpc;
  hiveEngineRpc: string;
  hiveEngineRpcError: string | null;
  accountHistoryAPIRpc: string;
  mobileSettings: MobileSettings;
}

export interface MobileSettings {
  platformRelevantFeatures: {[e: string]: PlatformOSType[]};
}
export interface SettingsPayload {
  rpc?: Rpc;
  hiveEngineRpc?: string;
  hiveEngineRpcError?: string | null;
  accountHistoryAPIRpc?: string;
  mobileSettings?: MobileSettings;
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
  desktop?: boolean;
  navigationHistory?: string[];
  navigationIndex?: number;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export interface BrowserPayload {
  url?: string;
  history?: Page;
  shouldFocus?: boolean;
  id?: number | null;
  data?: Partial<Tab>;
  showManagement?: boolean;
  favorite?: Page;
  favorites?: Page[];
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

export interface HiveEngineCurrency {
  usd_24h_change?: number;
  usd?: string;
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
  params?: any;
  skipTranslation?: boolean;
  callback?: () => void;
}

export interface FloatingBarPayload {
  showBasedOnScroll: boolean;
  isLoadingScreen: boolean;
  isDrawerOpened: boolean;
  isProposalRequestDisplayed: boolean;
  hide: boolean;
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
