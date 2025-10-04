import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CreateDataAccountOnBoarding} from 'src/interfaces/createAccounts.interface';

export type CreateAccountFromWalletParamList = {
  CreateAccountFromWalletScreenPageOne: {
    wallet: boolean;
    newPeerToPeerData?: CreateDataAccountOnBoarding;
  };
};

export type CreateAccountFromWalletNavigationRoute = RouteProp<
  CreateAccountFromWalletParamList,
  'CreateAccountFromWalletScreenPageOne'
>;

export type CreateAccountFromWalletNavigation = StackNavigationProp<
  CreateAccountFromWalletParamList,
  'CreateAccountFromWalletScreenPageOne'
>;

export type CreateAccountFromWalletNavigationProps = {
  navigation: CreateAccountFromWalletNavigation;
  route: CreateAccountFromWalletNavigationRoute;
};
