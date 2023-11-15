import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {createStackNavigator} from '@react-navigation/stack';
import CloseButton from 'components/ui/CloseButton';
import CustomIconButton from 'components/ui/CustomIconButton';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {translate} from 'utils/localize';
//TODO use just icon + add the exported only version from figma
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CancelTokenDelegation, {
  CancelTokenDelegationOperationProps,
} from 'components/operations/Cancel-token-delegation';
import Convert, {ConvertOperationProps} from 'components/operations/Convert';
import DelegateToken, {
  DelegateTokenOperationProps,
} from 'components/operations/DelegateToken';
import Delegation, {
  DelegationOperationProps,
} from 'components/operations/Delegation';
import PowerUp, {PowerUpOperationProps} from 'components/operations/PowerUp';
import RCDelegation, {
  RCDelegationOperationProps,
} from 'components/operations/RCDelegation';
import Savings, {SavingOperationProps} from 'components/operations/Savings';
import StakeToken, {
  StakeTokenOperationProps,
} from 'components/operations/StakeToken';
import Transfer, {TransferOperationProps} from 'components/operations/Transfer';
import UnstakeToken, {
  UnstakeTokenOperationProps,
} from 'components/operations/UnstakeToken';
import {OperationNavigationProps, RootStackParam} from 'navigators/Root.types';
import {capitalize} from 'utils/format';

const Stack = createStackNavigator<RootStackParam>();

export default ({navigation, route}: OperationNavigationProps) => {
  const {operation, props} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

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
      case 'cancel_delegation':
        return `${capitalize(
          translate('wallet.operations.token_delegation.cancelling_delegation'),
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
      case 'cancel_delegation':
        return (
          <CancelTokenDelegation
            {...(props as CancelTokenDelegationOperationProps)}
          />
        );
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
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Operation"
        component={() => renderOperation()}
        options={({navigation}) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: 'center',
          title: getTitle(),
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
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: getColors(theme).primaryBackground,
      borderWidth: 0,
      elevation: 0,
    },
    headerTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
    cardStyle: {
      backgroundColor: getColors(theme).primaryBackground,
    },
    headerRightContainer: {
      marginRight: 10,
    },
    headerLeftContainer: {
      marginLeft: 10,
    },
  });
