import {
  fetchPhishingAccounts,
  loadAccount,
  loadPrices,
  loadProperties,
} from 'actions/hive';
import {loadTokens, loadTokensMarket, loadUserTokens} from 'actions/index';
import PickerItem, {PickerItemInterface} from 'components/form/PickerItem';
import AccountValue from 'components/hive/AccountValue';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import PercentageDisplay from 'components/hive/PercentageDisplay';
import StatusIndicator from 'components/hive_authentication_service/StatusIndicator';
import Claim from 'components/operations/ClaimRewards';
import WhatsNewComponent from 'components/popups/whats-new/whats-new.component';
import Survey from 'components/survey';
import {BackgroundHexagons} from 'components/ui/BackgroundHexagons';
import DrawerButton from 'components/ui/DrawerButton';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import WalletPage from 'components/ui/WalletPage';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import Primary from 'screens/hive/wallet/Primary';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {getCardStyle} from 'src/styles/card';
import {
  BACKGROUNDITEMDARKISH,
  DARKER_RED_COLOR,
  OVERLAYICONBGCOLOR,
  getColors,
} from 'src/styles/colors';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {restartHASSockets} from 'utils/hiveAuthenticationService';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {getVP, getVotingDollarsPerAccount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
//TODO very important bellow:
//  1. add a new method, following the same as the extension to get userTokens, first test is a local using hooks here.
//  2. if works faster, then implement a new action, reducer, etc.
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
  prices,
  tokens,
  userTokens,
  tokensMarket,
  loadTokens,
  loadTokensMarket,
  loadUserTokens,
}: PropsFromRedux & {navigation: WalletNavigation}) => {
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  const [
    orderedUserTokenBalanceList,
    setOrderedUserTokenBalanceList,
  ] = useState<TokenBalance[]>([]);
  const [toggled, setToggled] = useState<number>(null);
  const [loadingUserTokens, setLoadingUserTokens] = useState(true);

  useEffect(() => {
    loadTokens();
    loadTokensMarket();
  }, [loadTokens, loadTokensMarket]);

  useEffect(() => {
    if (!userTokens.loading) {
      const list = userTokens.list.sort((a, b) => {
        return (
          getHiveEngineTokenValue(b, tokensMarket) -
          getHiveEngineTokenValue(a, tokensMarket)
        );
      });
      setOrderedUserTokenBalanceList(list);
      setLoadingUserTokens(false);
    }
  }, [userTokens]);

  useEffect(() => {
    if (user.name) {
      setLoadingUserTokens(true);
      loadUserTokens(user.name);
    }
  }, [loadUserTokens, user.name]);

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
      <ScrollView>
        <View style={styles.headerMenu}>
          <DrawerButton navigation={navigation as any} theme={theme} />
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
            name={translate('wallet.vp')}
            percent={getVP(user.account) || 100}
            IconBgcolor={OVERLAYICONBGCOLOR}
            theme={theme}
            iconName="send_square"
            bgColor={BACKGROUNDITEMDARKISH}
            secondary={`$${
              getVotingDollarsPerAccount(
                100,
                properties,
                user.account,
                false,
              ) || '0'
            }`}
          />
          <PercentageDisplay
            iconName="speedometer"
            bgColor={DARKER_RED_COLOR}
            name={translate('wallet.rc')}
            percent={user.rc.percentage || 100}
            IconBgcolor={OVERLAYICONBGCOLOR}
            theme={theme}
          />
        </View>
        <Separator />
        <BackgroundHexagons additionalSvgStyle={styles.extraBg} theme={theme} />
        <AccountValue
          account={user.account}
          prices={prices}
          properties={properties}
          theme={theme}
          title={translate('common.estimated_account_value')}
        />
        <Separator />
        <View
          style={[
            getCardStyle(theme).roundedCardItem,
            styles.fullListContainer,
          ]}>
          <Primary theme={theme} />
          <Separator height={10} />
          <View style={styles.separatorContainer} />
          <Separator height={10} />

          {!loadingUserTokens && orderedUserTokenBalanceList.length > 0 && (
            <FlatList
              data={orderedUserTokenBalanceList}
              contentContainerStyle={styles.flatlist}
              keyExtractor={(item) => item._id.toString()}
              ItemSeparatorComponent={() => <Separator height={10} />}
              renderItem={({item}) => (
                <EngineTokenDisplay
                  token={item}
                  tokensList={tokens}
                  market={tokensMarket}
                  toggled={toggled === item._id}
                  setToggle={() => {
                    if (toggled === item._id) setToggled(null);
                    else setToggled(item._id);
                  }}
                  using_new_ui
                />
              )}
            />
          )}

          {loadingUserTokens && (
            <View style={{height: 40}}>
              <Loader size={'small'} animating />
            </View>
          )}
        </View>
        <Survey navigation={navigation} />
        <WhatsNewComponent navigation={navigation} />
      </ScrollView>
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
    extraBg: {
      top: 110,
      opacity: 0.7,
    },
    fullListContainer: {
      flexGrow: 1,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: 15,
    },
    separatorContainer: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      height: 1,
      backgroundColor: getColors(theme).separatorBgColor,
      marginBottom: 10,
    },
    flatlist: {
      paddingBottom: 20,
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
      prices: state.currencyPrices,
      tokens: state.tokens,
      userTokens: state.userTokens,
      tokensMarket: state.tokensMarket,
    };
  },
  {
    loadAccount,
    loadProperties,
    loadPrices,
    fetchPhishingAccounts,
    loadTokens,
    loadUserTokens,
    loadTokensMarket,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Main);
