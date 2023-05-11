import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Account} from 'actions/interfaces';

export type CreateAccountFromWalletParamList = {
  CreateAccountFromWalletScreenPageOne: {wallet: boolean};
  CreateAccountFromWalletScreenPageTwo: {
    wallet: boolean;
    usedAccount: Account;
    newUsername: string;
    creationType: string;
    price: number;
  };
};

export type CreateAccountFromWalletNavigation = StackNavigationProp<
  CreateAccountFromWalletParamList,
  'CreateAccountFromWalletScreenPageOne'
>;

type CreateAccountFromWalletNavigationRoute = RouteProp<
  CreateAccountFromWalletParamList,
  'CreateAccountFromWalletScreenPageTwo'
>;

export type CreateAccountFromWalletNavigationProps = {
  navigation: CreateAccountFromWalletNavigation;
  route: CreateAccountFromWalletNavigationRoute;
};
