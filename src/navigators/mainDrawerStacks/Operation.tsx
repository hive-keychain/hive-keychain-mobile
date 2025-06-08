import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import ConfirmationPage from 'components/operations/Confirmation';
import Convert, {ConvertOperationProps} from 'components/operations/Convert';
import DelegateToken, {
  DelegateTokenOperationProps,
} from 'components/operations/DelegateToken';
import Delegation, {
  DelegationOperationProps,
} from 'components/operations/Delegation';
import PowerDown, {
  PowerDownOperationProps,
} from 'components/operations/PowerDown';
import PowerUp, {PowerUpOperationProps} from 'components/operations/PowerUp';
import RCDelegation, {
  RCDelegationOperationProps,
} from 'components/operations/RCDelegation';
import Savings, {SavingOperationProps} from 'components/operations/Savings';
import StakeToken, {
  StakeTokenOperationProps,
} from 'components/operations/StakeToken';
import Receive from 'components/operations/transfer/Receive';
import Transfer, {
  TransferOperationProps,
} from 'components/operations/transfer/Transfer';
import UnstakeToken, {
  UnstakeTokenOperationProps,
} from 'components/operations/UnstakeToken';
import VscDeposit, {VscDepositProps} from 'components/operations/VscDeposit';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import {OperationNavigationProps, RootStackParam} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {Dimensions} from 'utils/common.types';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';

const Stack = createStackNavigator<RootStackParam>();

export default ({navigation, route}: OperationNavigationProps) => {
  const {operation, props} = route.params;
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useSafeAreaInsets(), useWindowDimensions());

  const getTitle = () => {
    switch (operation) {
      case 'transfer':
        if ((props as TransferOperationProps).engine) {
          return `${capitalize(operation)} ${translate('common.token')}`;
        } else {
          return `${capitalize(operation)}`;
        }
      case 'stake':
        return `${capitalize(
          translate('wallet.operations.token_stake.staking'),
        )} ${translate('common.token')}`;
      case 'unstake':
        return `${capitalize(
          translate('wallet.operations.token_unstake.unstaking'),
        )} ${translate('common.token')}`;
      case 'delegate':
        return `${capitalize(
          translate('wallet.operations.token_delegation.delegating'),
        )} ${translate('common.token')}`;

      case 'power_up':
        return translate('wallet.operations.powerup.title');
      case 'savings':
        return translate(`wallet.operations.savings.currency_savings_title`, {
          currency: (props as SavingOperationProps).currency,
        });
      case 'convert':
        return `${translate('wallet.operations.convert.button')} ${
          (props as ConvertOperationProps).currency
        }`;
      case 'delegateHP':
        return translate('wallet.operations.delegation.title_delegation');
      case 'delegateRC':
        return translate('wallet.operations.rc_delegation.title');
      case 'power_down':
        return translate('wallet.operations.powerdown.title');
      case 'vsc_deposit':
        return translate('common.deposit');
    }
  };

  const renderOperation = () => {
    switch (operation) {
      case 'transfer':
        return <Transfer {...(props as TransferOperationProps)} />;
      case 'stake':
        return <StakeToken {...(props as StakeTokenOperationProps)} />;
      case 'unstake':
        return <UnstakeToken {...(props as UnstakeTokenOperationProps)} />;
      case 'delegate':
        return <DelegateToken {...(props as DelegateTokenOperationProps)} />;

      case 'power_up':
        return <PowerUp {...(props as PowerUpOperationProps)} />;
      case 'savings':
        return <Savings {...(props as SavingOperationProps)} />;
      case 'convert':
        return <Convert {...(props as ConvertOperationProps)} />;
      case 'delegateHP':
        return <Delegation {...(props as DelegationOperationProps)} />;
      case 'delegateRC':
        return <RCDelegation {...(props as RCDelegationOperationProps)} />;
      case 'power_down':
        return <PowerDown {...(props as PowerDownOperationProps)} />;
      case 'vsc_deposit':
        return <VscDeposit {...(props as VscDepositProps)} />;
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Operation"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle skipTranslation title={getTitle()} />
          ),
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => navigation.navigate('WALLET')}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}>
        {() => renderOperation()}
      </Stack.Screen>
      <Stack.Screen
        name="ReceiveTransfer"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => <NavigatorTitle title={'common.receive'} />,
          animationEnabled: false,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => {
                resetStackAndNavigate('WALLET');
              }}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        component={Receive}
      />
      <Stack.Screen
        name="ConfirmationPage"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => <NavigatorTitle title={'common.confirm'} />,
          animationEnabled: false,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => {
                resetStackAndNavigate('WALLET');
              }}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => (navigation as DrawerNavigationHelpers).goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        component={ConfirmationPage}
      />
    </Stack.Navigator>
  );
};

const getStyles = (
  theme: Theme,
  insets: EdgeInsets,
  {width, height}: Dimensions,
) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
      shadowColor: 'transparent',
      height: STACK_HEADER_HEIGHT + insets.top,
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    headerRightContainer: {
      marginRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      marginLeft: HEADER_ICON_MARGIN,
    },
  });
