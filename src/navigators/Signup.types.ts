import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AccountKeys} from 'actions/interfaces';

export type SignupStackParamList = {
  IntroductionScreen: undefined;
  CreateAccountScreen: undefined;
  CreateAccountPeerToPeerScreen: undefined;
  SignupScreen: undefined;
  ChooseAccountOptionsScreen: undefined;
  AddAccountByKeyScreen: undefined;
  ScanQRScreen: undefined;
  CreateAccountConfirmationScreen: undefined;
  CreateAccountPeerToPeerQrScreen: {
    accountName: string;
    keys: AccountKeys;
    qrData: string;
  };
};

export type SignupNavigation = StackNavigationProp<
  SignupStackParamList,
  'SignupScreen'
>;

export type SignupNavProp = {navigation: SignupNavigation};

export type IntroductionNavigation = StackNavigationProp<
  SignupStackParamList,
  'IntroductionScreen'
>;

export type IntroductionNavProp = {navigation: IntroductionNavigation};

type AddAccNavigation = StackNavigationProp<
  SignupStackParamList,
  'AddAccountByKeyScreen'
>;
type AddAccNavigationRoute = RouteProp<
  SignupStackParamList,
  'AddAccountByKeyScreen'
>;

export type AddAccNavigationProps = {
  navigation: AddAccNavigation;
  route: AddAccNavigationRoute;
};
