import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TokenHistoryProps} from 'components/operations/Tokens-history';
import {TransferOperationProps} from 'components/operations/Transfer';
import {StyleProp, ViewStyle} from 'react-native';

export type ModalPosition =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | undefined;

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
    additionalWrapperFixedStyle?: StyleProp<ViewStyle>;
    modalPosition?: ModalPosition;
    renderButtonElement?: JSX.Element;
  };
  TokensHistory: TokenHistoryProps;
  //TODO test adding bellow other types.
  Operation: {
    operation: 'transfer';
    props: TransferOperationProps;
  };
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

export type OperationNavigation = StackNavigationProp<
  RootStackParam,
  'Operation'
>;

export type OperationNavigationRoute = RouteProp<RootStackParam, 'Operation'>;

export type OperationNavigationProps = {
  navigation: OperationNavigation;
  route: OperationNavigationRoute;
};
