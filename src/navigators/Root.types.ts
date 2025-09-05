import {TransferOperation} from '@hiveio/dhive';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {WalletHistoryComponentProps} from 'components/history/WalletHistoryComponent';
import {TokenHistoryProps} from 'components/history/hive-engine/TokensHistory';
import {ConfirmationPageProps} from 'components/operations/Confirmation';
import {ConvertOperationProps} from 'components/operations/Convert';
import {DelegateTokenOperationProps} from 'components/operations/DelegateToken';
import {DelegationOperationProps} from 'components/operations/Delegation';
import {PowerDownOperationProps} from 'components/operations/PowerDown';
import {PowerUpOperationProps} from 'components/operations/PowerUp';
import {RCDelegationOperationProps} from 'components/operations/RCDelegation';
import {SavingOperationProps} from 'components/operations/Savings';
import {StakeTokenOperationProps} from 'components/operations/StakeToken';
import {UnstakeTokenOperationProps} from 'components/operations/UnstakeToken';
import {TransferOperationProps} from 'components/operations/transfer/Transfer';
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
  modalContent?: React.JSX.Element;
  onForceCloseModal?: () => void;
  name: string;
  data?: any;
  centerModal?: boolean | undefined;
  fixedHeight?: number;
  modalContainerStyle?: StyleProp<ViewStyle>;
  additionalWrapperFixedStyle?: StyleProp<ViewStyle>;
  modalPosition?: ModalPosition;
  bottomHalf?: boolean;
  renderButtonElement?: React.JSX.Element;
}

// TemplateStack removed; use concrete screens instead

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
      | 'power_up'
      | 'savings'
      | 'convert'
      | 'delegateHP'
      | 'delegateRC'
      | 'power_down';
    props:
      | TransferOperationProps
      | StakeTokenOperationProps
      | UnstakeTokenOperationProps
      | DelegateTokenOperationProps
      | PowerUpOperationProps
      | SavingOperationProps
      | ConvertOperationProps
      | DelegationOperationProps
      | RCDelegationOperationProps
      | PowerDownOperationProps;
  };
  // TemplateStack: removed
  WalletHistory: WalletHistoryComponentProps;
  SwapBuyStack: undefined;
  SwapHistory: undefined;
  ConfirmationPage: ConfirmationPageProps;
  ReceiveTransfer: ReceiveTransferProps;
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

// TemplateStack types removed

export type ConfirmationPageRoute = RouteProp<
  RootStackParam,
  'ConfirmationPage'
>;
export type ReceiveTransferProps = ['transfer', Partial<TransferOperation[1]>];

export type ReceiveTransferRoute = RouteProp<RootStackParam, 'ReceiveTransfer'>;
