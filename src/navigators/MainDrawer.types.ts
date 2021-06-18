import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type MainDrawerStackParam = {
  WALLET: undefined;
  BrowserScreen: undefined;
  AccountManagementScreen: undefined;
  AddAccountStack: undefined;
  SettingsScreen: undefined;
  ABOUT: undefined;
};

type BrowserNavigation = StackNavigationProp<
  MainDrawerStackParam,
  'BrowserScreen'
>;
type BrowserNavigationRoute = RouteProp<MainDrawerStackParam, 'BrowserScreen'>;

export type BrowserNavigationProps = {
  navigation: BrowserNavigation;
  route: BrowserNavigationRoute;
};

type WalletNavigation = StackNavigationProp<MainDrawerStackParam, 'WALLET'>;

export type WalletNavigationProps = {
  navigation: WalletNavigation;
};

type MgtNavigation = StackNavigationProp<MainDrawerStackParam, 'AccountManagementScreen'>;

export type MgtNavigationProps = {
  navigation: MgtNavigation;
};