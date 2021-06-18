import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type AddAccountFromWalletParamList = {
  ScanQRScreen: undefined;
  AddAccountFromWalletScreen: {wallet: boolean};
};

export type AddAccFromWalletNavigation = StackNavigationProp<
AddAccountFromWalletParamList,
  'AddAccountFromWalletScreen'
>;
type AddAccFromWalletNavigationRoute = RouteProp<
AddAccountFromWalletParamList,
  'AddAccountFromWalletScreen'
>;

export type AddAccFromWalletNavigationProps = {
  navigation: AddAccFromWalletNavigation;
  route: AddAccFromWalletNavigationRoute;
};