import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

export type BrowserParamList = {
  BrowserScreen: {icon: string};
};
type BrowserNavigationRoute = RouteProp<BrowserParamList, 'BrowserScreen'>;

type BrowserNavigation = StackNavigationProp<BrowserParamList, 'BrowserScreen'>;

export type BrowserNavigationProps = {
  navigation: BrowserNavigation;
  route: BrowserNavigationRoute;
};

export type BrowserScreenProps = StackScreenProps<
  BrowserParamList,
  'BrowserScreen'
>;
