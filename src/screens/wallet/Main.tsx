import {
  fetchPhishingAccounts,
  loadAccount,
  loadPrices,
  loadProperties,
} from 'actions/hive';
import UserPicker from 'components/form/UserPicker';
import PercentageDisplay from 'components/hive/PercentageDisplay';
import {WalletHistoryComponent} from 'components/hive/Wallet-history-component';
import WhatsNewComponent from 'components/popups/whats-new/whats-new.component';
import Survey from 'components/survey';
import ScreenToggle from 'components/ui/ScreenToggle';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useRef} from 'react';
import {
  AppState,
  AppStateStatus,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import Primary from 'screens/wallet/Primary';
import Tokens from 'screens/wallet/Tokens';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {restartHASSockets} from 'utils/hiveAuthenticationService';
import {getVP, getVotingDollarsPerAccount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';

const Main = ({
  loadAccount,
  loadProperties,
  loadPrices,
  fetchPhishingAccounts,
  user,
  properties,
  accounts,
  lastAccount,
  navigation,
  hive_authentication_service,
}: PropsFromRedux & {navigation: WalletNavigation}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  const updateUserWallet = (lastAccount: string | undefined) => {
    loadAccount(lastAccount || accounts[0].name);
    loadProperties();
    loadPrices();
    fetchPhishingAccounts();
  };

  useEffect(() => {
    updateUserWallet(lastAccount);
  }, [
    loadAccount,
    accounts,
    loadProperties,
    loadPrices,
    fetchPhishingAccounts,
    lastAccount,
  ]);

  useLockedPortrait(navigation);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handler = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (
          hive_authentication_service.instances.length &&
          !hive_authentication_service.instances.filter(
            (e) => e.init && e.connected,
          ).length
        ) {
          restartHASSockets();
        }
      }

      appState.current = nextAppState;
    };
    AppState.addEventListener('change', handler);

    return () => {
      AppState.removeEventListener('change', handler);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateUserWallet(lastAccount);
    });

    return unsubscribe;
  }, [navigation, lastAccount]);

  if (!user) {
    return null;
  }

  return (
    <WalletPage>
      <>
        <UserPicker
          accounts={accounts.map((account) => account.name)}
          username={user.name!}
          onAccountSelected={loadAccount}
        />
        <View style={styles.resourcesWrapper}>
          <PercentageDisplay
            name={translate('wallet.rc')}
            percent={user.rc.percentage / 100 || 100}
            color="#E59D15"
          />
          <PercentageDisplay
            name={translate('wallet.vp')}
            percent={getVP(user.account) || 100}
            color="#3BB26E"
            secondary={`$${
              getVotingDollarsPerAccount(
                100,
                properties,
                user.account,
                false,
              ) || '0'
            }`}
          />
        </View>
        <ScreenToggle
          style={styles.toggle}
          menu={[
            translate(`wallet.menu.hive`),
            translate(`wallet.menu.history`),
            translate(`wallet.menu.tokens`),
          ]}
          toUpperCase
          components={[<Primary />, <WalletHistoryComponent />, <Tokens />]}
        />
        <Survey navigation={navigation} />
        <WhatsNewComponent navigation={navigation} />
      </>
    </WalletPage>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    textCentered: {textAlign: 'center'},
    white: {color: 'white'},
    resourcesWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
    },
    toggle: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      properties: state.properties,
      accounts: state.accounts,
      lastAccount: state.lastAccount.name,
      hive_authentication_service: state.hive_authentication_service,
    };
  },
  {
    loadAccount,
    loadProperties,
    loadPrices,
    fetchPhishingAccounts,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Main);
