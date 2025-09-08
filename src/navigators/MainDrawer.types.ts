import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type MainDrawerStackParam = {
  WALLET: undefined;
  BrowserScreen: {icon: string};
  Accounts: undefined;
  // Consolidated: related screens live under Accounts stack now
  SettingsScreen: undefined;
  ABOUT: undefined;
  Governance: undefined;
  Tokens: undefined;
  TokensHistory: undefined;
  Operation: undefined;
  TemplateStack: undefined;
  SwapBuyStack: undefined;
  SwapHistory: undefined;
  Help: undefined;
  TokenSettings: undefined;
  TokenDelegations: undefined;
  HPDelegations: undefined;
  PendingSavings: undefined;
  PendingConversions: undefined;
  RcDelegations: undefined;
  SwapConfirm: undefined;
  ToggleWitness: undefined;
  CreateAccountConfirmationScreen: undefined;
};

export type BrowserNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'BrowserScreen'
>;
type BrowserNavigationRoute = RouteProp<MainDrawerStackParam, 'BrowserScreen'>;

export type BrowserNavigationProps = {
  navigation: BrowserNavigation;
  route: BrowserNavigationRoute;
};

export type WalletNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'WALLET'
>;

export type GovernanceNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'Governance'
>;

export type WalletNavigationProps = {
  navigation: WalletNavigation;
};

export type MgtNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'AccountManagementScreen'
>;

export type MgtNavigationProps = {
  navigation: MgtNavigation;
};

export type AboutNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'ABOUT'
>;

export type SettingsNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'SettingsScreen'
>;
