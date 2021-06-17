import {StackNavigationProp} from '@react-navigation/stack';

export type UnlockStackParamList = {
  UnlockScreen: undefined;
};

type UnlockNavigation = StackNavigationProp<
  UnlockStackParamList,
  'UnlockScreen'
>;
export type UnlockNavigationProp = {navigation: UnlockNavigation};
