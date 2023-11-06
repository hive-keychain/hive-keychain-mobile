import {
  fetchPhishingAccounts,
  loadAccount,
  loadPrices,
  loadProperties,
} from 'actions/hive';
import PickerItem, {PickerItemInterface} from 'components/form/PickerItem';
import PercentageDisplay from 'components/hive/PercentageDisplay';
import {WalletHistoryComponent} from 'components/hive/Wallet-history-component';
import StatusIndicator from 'components/hive_authentication_service/StatusIndicator';
import Claim from 'components/operations/ClaimRewards';
import WhatsNewComponent from 'components/popups/whats-new/whats-new.component';
import Survey from 'components/survey';
import DrawerButton from 'components/ui/DrawerButton';
import ScreenToggle from 'components/ui/ScreenToggle';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React, {useContext, useEffect, useRef} from 'react';
import {
  AppState,
  AppStateStatus,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import Primary from 'screens/hive/wallet/Primary';
import Tokens from 'screens/hive/wallet/Tokens';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {
  BACKGROUNDDARKBLUE,
  DARKER_RED_COLOR,
  OVERLAYICONBGCOLOR,
  getColors,
} from 'src/styles/colors';
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
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions(), theme);

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

  if (!user || !user.name) {
    return null;
  }

  const getItemDropDownSelected = (username: string): PickerItemInterface => {
    const selected = accounts.filter((acc) => acc.name === username)[0]!;
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  return (
    <WalletPage>
      <>
        <View style={styles.headerMenu}>
          <DrawerButton navigation={navigation} theme={theme} />
          <View style={styles.innerHeader}>
            <StatusIndicator theme={theme} />
            <Claim theme={theme} />
            <PickerItem
              selected={getItemDropDownSelected(user.name)}
              theme={theme}
              pickerItemList={accounts.map((acc) => {
                return {
                  label: acc.name,
                  value: acc.name,
                  icon: (
                    <UserProfilePicture
                      username={acc.name}
                      style={styles.avatar}
                    />
                  ),
                };
              })}
              additionalContainerStyle={styles.userPicker}
              additionalExpandedListItemContainerStyle={{
                padding: 10,
              }}
              removeDropdownIcon
              onSelectedItem={(item) => loadAccount(item.value)}
            />
          </View>
        </View>
        <Separator />
        <View style={styles.rowWrapper}>
          <PercentageDisplay
            name={translate('wallet.rc')}
            percent={user.rc.percentage || 100}
            IconBgcolor={OVERLAYICONBGCOLOR}
            theme={theme}
            iconName="send_square"
            bgColor={BACKGROUNDDARKBLUE}
          />
          <PercentageDisplay
            iconName="speedometer"
            bgColor={DARKER_RED_COLOR}
            name={translate('wallet.vp')}
            percent={getVP(user.account) || 100}
            IconBgcolor={OVERLAYICONBGCOLOR}
            secondary={`$${
              getVotingDollarsPerAccount(
                100,
                properties,
                user.account,
                false,
              ) || '0'
            }`}
            theme={theme}
          />
        </View>
        <Separator />
        <ScreenToggle
          theme={theme}
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

const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    textCentered: {textAlign: 'center'},
    white: {color: 'white'},
    rowWrapper: {
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
    avatar: {width: 25, height: 25, borderRadius: 50},
    userPicker: {
      width: 145,
      height: 44,
      borderWidth: 1,
      borderColor: getColors(theme).walletUserPickerBorder,
      borderRadius: 11,
    },
    headerMenu: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      paddingTop: 5,
      paddingBottom: 5,
      paddingRight: 15,
    },
    innerHeader: {flexDirection: 'row', height: 44, alignItems: 'center'},
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
