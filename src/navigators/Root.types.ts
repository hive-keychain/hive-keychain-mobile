import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CancelTokenDelegationOperationProps} from 'components/operations/Cancel-token-delegation';
import {DelegateTokenOperationProps} from 'components/operations/DelegateToken';
import {StakeTokenOperationProps} from 'components/operations/StakeToken';
import {TokenHistoryProps} from 'components/operations/Tokens-history';
import {TransferOperationProps} from 'components/operations/Transfer';
import {UnstakeTokenOperationProps} from 'components/operations/UnstakeToken';
import {StyleProp, ViewStyle} from 'react-native';

export type ModalPosition =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | undefined;

export interface ModalScreenProps {
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
}

export interface GeneralStackProps {
  titleScreen: string;
  component: JSX.Element;
}

export type RootStackParam = {
  Main: undefined;
  ModalScreen: ModalScreenProps;
  TokensHistory: TokenHistoryProps;
  Operation: {
    operation:
      | 'transfer'
      | 'stake'
      | 'unstake'
      | 'delegate'
      | 'cancel_delegation';
    props:
      | TransferOperationProps
      | StakeTokenOperationProps
      | UnstakeTokenOperationProps
      | DelegateTokenOperationProps
      | CancelTokenDelegationOperationProps;
  };
  GeneralStack: GeneralStackProps;
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

export type GeneralStackNavigation = StackNavigationProp<
  RootStackParam,
  'GeneralStack'
>;

export type GeneralStackNavigationRoute = RouteProp<
  RootStackParam,
  'GeneralStack'
>;

export type GeneralStackNavigationProps = {
  navigation: GeneralStackNavigation;
  route: GeneralStackNavigationRoute;
};
