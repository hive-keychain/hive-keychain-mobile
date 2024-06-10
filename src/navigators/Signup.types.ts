import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type SignupStackParamList = {
  IntroductionScreen: undefined;
  CreateAccountScreen: undefined;
  CreateAccountPeerToPeerScreen: undefined;
  SignupScreen: undefined;
  AddAccountByKeyScreen: undefined;
  ScanQRScreen: undefined;
  TemplateStackScreen: undefined;
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
