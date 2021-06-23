import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type BrowserParamList = {
  BrowserScreen: {icon: string};
};
type BrowserNavigationRoute = RouteProp<BrowserParamList, 'BrowserScreen'>;

type BrowserNavigation = StackNavigationProp<BrowserParamList, 'BrowserScreen'>;

export type BrowserNavigationProps = {
  navigation: BrowserNavigation;
  route: BrowserNavigationRoute;
};
