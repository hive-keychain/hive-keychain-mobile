import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type MainDrawerStackParam = {
  Wallet: undefined;
  Browser: {icon: string};
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
  Help: undefined;
  TokenSettings: undefined;
  TokenDelegations: undefined;
  // nested under Operation stack
  ToggleWitness: undefined;
  CreateAccountConfirmationScreen: undefined;
};

export type BrowserNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'Browser'
>;
type BrowserNavigationRoute = RouteProp<MainDrawerStackParam, 'Browser'>;

export type BrowserNavigationProps = {
  navigation: BrowserNavigation;
  route: BrowserNavigationRoute;
};

export type WalletNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'Wallet'
>;

export type GovernanceNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'Governance'
>;

export type WalletNavigationProps = {
  navigation: WalletNavigation;
};

export type AboutNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'ABOUT'
>;

export type SettingsNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'SettingsScreen'
>;
