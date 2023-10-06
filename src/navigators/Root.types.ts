import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TokenHistoryProps} from 'components/operations/Tokens-history';
import {StyleProp, ViewStyle} from 'react-native';

export type RootStackParam = {
  Main: undefined;
  ModalScreen: {
    modalContent?: JSX.Element;
    onForceCloseModal?: () => void;
    name: string;
    data?: any;
    centerModal?: boolean | undefined;
    fixedHeight?: number;
    modalContainerStyle?: StyleProp<ViewStyle>;
  };
  TokensHistory: TokenHistoryProps;
};

export type MainNavigation = StackNavigationProp<RootStackParam, 'Main'>;

export type ModalNavigation = StackNavigationProp<
  RootStackParam,
  'ModalScreen'
>;
export type ModalNavigationRoute = RouteProp<RootStackParam, 'ModalScreen'>;

export type ModalNavigationProps = {
  navigation: ModalNavigation;
  route: ModalNavigationRoute;
};

export type TokensHistoryNavigation = StackNavigationProp<
  RootStackParam,
  'TokensHistory'
>;

export type TokensHistoryNavigationRoute = RouteProp<
  RootStackParam,
  'TokensHistory'
>;

export type TokensHistoryNavigationProps = {
  navigation: TokensHistoryNavigation;
  route: TokensHistoryNavigationRoute;
};
