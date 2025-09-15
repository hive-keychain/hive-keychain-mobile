import {createStackNavigator} from '@react-navigation/stack';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import PendingConversions from 'components/hive/PendingConversions';
import PendingSavingsWithdrawalPageComponent from 'components/hive/PendingSavingsWithdrawalPage.component';
import ConfirmationPage from 'components/operations/Confirmation';
import Convert, {ConvertOperationProps} from 'components/operations/Convert';
import DelegateToken, {
  DelegateTokenOperationProps,
} from 'components/operations/DelegateToken';
import Delegation, {
  DelegationOperationProps,
} from 'components/operations/Delegation';
import DelegationsList from 'components/operations/DelegationsList';
import IncomingOutGoingRCDelegations from 'components/operations/IncomingOutGoingRCDelegations';
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
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import NavigatorTitle from 'components/ui/NavigatorTitle';
import {OperationNavigationProps, RootStackParam} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {HEADER_ICON_MARGIN} from 'src/styles/headers';
import {STACK_HEADER_HEIGHT} from 'src/styles/spacing';
import {capitalize} from 'utils/format.utils';
import {translate} from 'utils/localize';
import {
  buildIOSHorizontalStackOptions,
  resetStackAndNavigate,
} from 'utils/navigation.utils';

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
    }
  };

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={buildIOSHorizontalStackOptions(
        getColors(theme).primaryBackground,
      )}>
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
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Wallet');
              }}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}>
        {() => renderOperation()}
      </Stack.Screen>
      <Stack.Screen
        name="HPDelegations"
        options={({navigation, route}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={`common.${(route.params as any)?.type}`} />
          ),
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        children={({route}) => (
          <DelegationsList type={(route.params as any).type} theme={theme} />
        )}
      />
      <Stack.Screen
        name="RcDelegations"
        options={({navigation, route}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle
              title={(route.params as any)?.type}
              skipTranslation
            />
          ),
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        children={({route}) => (
          <IncomingOutGoingRCDelegations
            type={(route.params as any).type}
            total={(route.params as any).total}
            available={(route.params as any).available}
          />
        )}
      />
      <Stack.Screen
        name="PendingSavings"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={'wallet.operations.savings.pending'} />
          ),
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        children={({route}) => (
          <PendingSavingsWithdrawalPageComponent
            currency={(route.params as any).currency}
            operation={(route.params as any).operation}
            currentWithdrawingList={
              (route.params as any).currentWithdrawingList
            }
            onUpdate={(route.params as any).onUpdate}
          />
        )}
      />
      <Stack.Screen
        name="PendingConversions"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <NavigatorTitle title={'wallet.operations.convert.pending'} />
          ),
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
            />
          ),
        })}
        children={({route}) => (
          <PendingConversions
            currency={(route.params as any).currency}
            currentPendingConversionList={
              (route.params as any).currentPendingConversionList
            }
          />
        )}
      />
      <Stack.Screen
        name="ReceiveTransfer"
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleAlign: 'center',
          headerTitle: () => <NavigatorTitle title={'common.receive'} />,
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => {
                resetStackAndNavigate('Wallet');
              }}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
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
          headerRightContainerStyle: styles.headerRightContainer,
          headerLeftContainerStyle: styles.headerLeftContainer,
          headerRight: () => (
            <CloseButton
              theme={theme}
              onPress={() => {
                resetStackAndNavigate('Wallet');
              }}
            />
          ),
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
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
      paddingRight: HEADER_ICON_MARGIN,
    },
    headerLeftContainer: {
      paddingLeft: HEADER_ICON_MARGIN,
    },
  });
