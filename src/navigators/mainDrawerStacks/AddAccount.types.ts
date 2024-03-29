import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type AddAccountFromWalletParamList = {
  ScanQRScreen: {wallet: boolean};
  AddAccountFromWalletScreen: {wallet: boolean};
  AddAccountFromWalletScreenByAuth: {wallet: boolean};
};

export type AddAccFromWalletNavigation = StackNavigationProp<
  AddAccountFromWalletParamList,
  'AddAccountFromWalletScreen'
>;
export type AddAccFromWalletNavigationRoute = RouteProp<
  AddAccountFromWalletParamList,
  'AddAccountFromWalletScreen'
>;

export type AddAccFromWalletNavigationProps = {
  navigation: AddAccFromWalletNavigation;
  route: AddAccFromWalletNavigationRoute;
};
