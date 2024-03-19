import {StackNavigationProp} from '@react-navigation/stack';

export type CreateAccountFromWalletParamList = {
  CreateAccountFromWalletScreenPageOne: {wallet: boolean};
};

export type CreateAccountFromWalletNavigation = StackNavigationProp<
  CreateAccountFromWalletParamList,
  'CreateAccountFromWalletScreenPageOne'
>;
