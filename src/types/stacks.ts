import {StackNavigationProp} from '@react-navigation/stack';

//Root
export type RootStackParam = {
  Main: undefined;
  ModalScreen: undefined;
};

//Unlock
export type UnlockStackParamList = {
  UnlockScreen: undefined;
};

type UnlockNavigation = StackNavigationProp<
  UnlockStackParamList,
  'UnlockScreen'
>;
export type UnlockNavigationProp = {navigation: UnlockNavigation};

// Signup

export type SignupStackParamList = {
  IntroductionScreen: undefined;
  CreateAccountScreen: undefined;
  SignupScreen: undefined;
  AddAccountByKeyScreen: undefined;
  ScanQRScreen: undefined;
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
