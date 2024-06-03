import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import {
  setIsDrawerOpen,
  setisLoadingScreen,
  showFloatingBar,
} from 'actions/floatingBar';
import {
  fetchPhishingAccounts,
  loadAccount,
  loadPrices,
  loadProperties,
} from 'actions/hive';
import {loadTokens, loadTokensMarket} from 'actions/index';
import HiveEngineLogo from 'assets/new_UI/hive-engine.svg';
import CustomSearchBar from 'components/form/CustomSearchBar';
import UserDropdown from 'components/form/UserDropdown';
import AccountValue from 'components/hive/AccountValue';
import CurrencyToken from 'components/hive/CurrencyToken';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Icon from 'components/hive/Icon';
import PercentageDisplay from 'components/hive/PercentageDisplay';
import StatusIndicator from 'components/hive_authentication_service/StatusIndicator';
import Claim from 'components/operations/ClaimRewards';
import {TutorialPopup} from 'components/popups/tutorial/Tutorial';
import WhatsNew from 'components/popups/whats-new/WhatsNew';
import WidgetConfiguration from 'components/popups/widget-configuration/WidgetConfiguration';
import {ProposalVotingSectionComponent} from 'components/proposal-voting/proposalVoting';
import DrawerButton from 'components/ui/DrawerButton';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import WalletPage from 'components/ui/WalletPage';
import {useBackButtonNavigation} from 'hooks/useBackButtonNavigate';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  NativeEventEmitter,
  NativeModules,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {getCardStyle} from 'src/styles/card';
import {
  BACKGROUNDITEMDARKISH,
  DARKBLUELIGHTER,
  DARKER_RED_COLOR,
  NEUTRAL_WHITE_COLOR,
  OVERLAYICONBGCOLOR,
  getColors,
} from 'src/styles/colors';
import {TOP_CONTAINER_SEPARATION} from 'src/styles/spacing';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  button_link_primary_medium,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {getCurrency} from 'utils/hive';
import {restartHASSockets} from 'utils/hiveAuthenticationService';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {getVP, getVotingDollarsPerAccount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {WidgetUtils} from 'utils/widget.utils';
import TokenSettings from './tokens/TokenSettings';

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
  loadTokens,
  loadTokensMarket,
  showFloatingBar,
  setIsDrawerOpen,
  setisLoadingScreen,
  tokens,
  userTokens,
  tokensMarket,
  rpc,
}: PropsFromRedux & {navigation: WalletNavigation}) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const styles = getDimensionedStyles({width, height}, theme, insets);
  const [loadingUserAndGlobals, setLoadingUserAndGlobals] = useState(true);
  const sectionListRef = useRef();
  const [toggled, setToggled] = useState<number>(null);
  const [
    orderedUserTokenBalanceList,
    setOrderedUserTokenBalanceList,
  ] = useState<TokenBalance[]>([]);
  const [
    filteredUserTokenBalanceList,
    setFilteredUserTokenBalanceList,
  ] = useState<TokenBalance[]>([]);
  const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [lastScrollYValue, setLastScrollYValue] = useState(0);
  const [isHiveEngineLoading, setIsHiveEngineLoading] = useState(true);
  const mainScrollRef = useRef();

  const [eventReceived, setEventReceived] = useState(null);
  const [showWidgetConfiguration, setShowWidgetConfiguration] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateUserWallet(user.name);
  }, [user.name]);

  useEffect(() => {
    if (Platform.OS === 'ios') return;
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('command_event', (event) => {
      if (event && Object.values(event).length >= 1) {
        setEventReceived(event);
      }
    });
    if (eventReceived) {
      if (eventReceived.currency) {
        const {currency: command} = eventReceived;
        if (command === 'update_values_currency_list') {
          WidgetUtils.sendWidgetData('currency_list');
        }
      } else if (eventReceived.navigateTo) {
        //IF implementation needed in the future
        const {navigateTo: route} = eventReceived;
        navigation.navigate(route);
      } else if (eventReceived.configureWidgets) {
        const {configureWidgets} = eventReceived;
        setShowWidgetConfiguration(Boolean(configureWidgets));
      }
    }
    return () => {
      eventListener.remove();
    };
  }, [eventReceived]);

  useEffect(() => {
    // Stop the page refreshing after all is fetched
    if (!userTokens.loading && user.account?.active) {
      setRefreshing(false);
    }
  }, [user, userTokens.loading]);

  useEffect(() => {
    loadTokens();
    loadTokensMarket();
  }, [loadTokens, loadTokensMarket]);

  useEffect(() => {
    if (!userTokens.loading) {
      let list = userTokens.list.sort((a, b) => {
        return (
          getHiveEngineTokenValue(b, tokensMarket) -
          getHiveEngineTokenValue(a, tokensMarket)
        );
      });
      setFilteredUserTokenBalanceList(
        list.filter((userToken) => !hiddenTokens.includes(userToken.symbol)),
      );
      setOrderedUserTokenBalanceList(list);
      setIsHiveEngineLoading(false);
    } else {
      setFilteredUserTokenBalanceList([]);
      setIsHiveEngineLoading(true);
    }
  }, [userTokens.loading, hiddenTokens, tokensMarket]);

  useEffect(() => {
    if (
      properties.globals &&
      Object.keys(properties.globals).length > 0 &&
      user.name
    ) {
      setLoadingUserAndGlobals(false);
      setisLoadingScreen(false);
      if (!userTokens.loading) {
        loadHiddenTokens();
      }
    }
  }, [properties, user.name]);

  useEffect(() => {
    const filtered = orderedUserTokenBalanceList.filter(
      (token) =>
        token.balance.toLowerCase().includes(searchValue.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredUserTokenBalanceList(
      filtered.filter(
        (filteredToken) => !hiddenTokens.includes(filteredToken.symbol),
      ),
    );
  }, [searchValue]);

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

  useBackButtonNavigation('WALLET', true);
  useLockedPortrait(navigation);

  const appState = useRef(AppState.currentState);

  const isDrawerOpen: boolean = useIsDrawerOpen();

  useEffect(() => {
    setIsDrawerOpen(isDrawerOpen);
  }, [isDrawerOpen]);

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

  const loadHiddenTokens = async () => {
    let customHiddenTokens = null;
    try {
      customHiddenTokens = JSON.parse(
        await AsyncStorage.getItem(KeychainStorageKeyEnum.HIDDEN_TOKENS),
      );
      setHiddenTokens(customHiddenTokens ?? []);
    } catch (error) {
      console.log('Error reading hiddenTokens');
    }
  };

  const onHandleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    showFloatingBar(
      event.nativeEvent.contentOffset.y === 0 ||
        event.nativeEvent.contentOffset.y < lastScrollYValue,
    );
    setLastScrollYValue(event.nativeEvent.contentOffset.y);
  };

  const handleClickSettings = () => {
    navigate('TemplateStack', {
      titleScreen: translate('wallet.operations.token_settings.title'),
      component: <TokenSettings />,
      hideCloseButton: true,
    } as TemplateStackProps);
  };

  const handleClickToView = (index: number, sectionIndex: 0 | 1) => {
    if (sectionListRef && sectionListRef.current) {
      (sectionListRef as any).current.scrollToLocation({
        animated: true,
        itemIndex: index,
        sectionIndex: sectionIndex,
        viewPosition: 1,
      });
    }
  };

  return (
    <WalletPage
      additionalBgSvgImageStyle={
        !loadingUserAndGlobals && rpc && rpc.uri !== 'NULL'
          ? {top: '15%'}
          : undefined
      }>
      <>
        {!loadingUserAndGlobals && rpc && rpc.uri !== 'NULL' ? (
          <View>
            <Separator height={TOP_CONTAINER_SEPARATION} />
            <View style={[styles.headerMenu]}>
              <DrawerButton navigation={navigation as any} theme={theme} />
              <View style={[styles.innerHeader]}>
                <StatusIndicator theme={theme} />
                <Claim theme={theme} />
                <View style={styles.marginRight}>
                  <UserDropdown
                    dropdownIconScaledSize={styles.smallIcon}
                    additionalDropdowContainerStyle={styles.userdropdown}
                    additionalMainContainerDropdown={[styles.dropdownContainer]}
                    additionalOverlayStyle={[styles.dropdownOverlay]}
                    additionalListExpandedContainerStyle={
                      styles.dropdownExpandedContainer
                    }
                    copyButtonValue
                  />
                </View>
              </View>
            </View>
            <Separator />
            <View
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                height: '100%',
              }}>
              <ScrollView
                ref={mainScrollRef}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                scrollEventThrottle={200}
                onScroll={onHandleScroll}>
                <View style={styles.rowWrapper}>
                  <PercentageDisplay
                    name={translate('wallet.vp')}
                    percent={getVP(user.account) || 100}
                    IconBgcolor={OVERLAYICONBGCOLOR}
                    theme={theme}
                    iconName={Icons.SEND_SQUARE}
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
                    iconName={Icons.SPEEDOMETER}
                    bgColor={DARKER_RED_COLOR}
                    name={translate('wallet.rc')}
                    percent={user.rc.percentage || 100}
                    IconBgcolor={OVERLAYICONBGCOLOR}
                    theme={theme}
                  />
                </View>
                <Separator />
                <AccountValue
                  account={user.account}
                  prices={prices}
                  properties={properties}
                  theme={theme}
                  title={translate('common.estimated_account_value')}
                />
                <Separator />
                <View style={getCardStyle(theme).borderTopCard}>
                  <View>
                    {[
                      {currency: getCurrency('HIVE')},
                      {currency: getCurrency('HBD')},
                      {currency: getCurrency('HP')},
                    ].map((item, index) => (
                      <CurrencyToken
                        key={`${item.currency}`}
                        theme={theme}
                        currencyName={item.currency}
                        itemIndex={index}
                        onPress={() => handleClickToView(index, 0)}
                      />
                    ))}
                  </View>

                  <View style={[getCardStyle(theme).wrapperCardItem]}>
                    <View
                      style={[
                        styles.flexRow,
                        isSearchOpen ? styles.paddingVertical : undefined,
                      ]}>
                      <HiveEngineLogo height={23} width={23} />
                      <View style={styles.separatorContainer} />
                      {isSearchOpen ? (
                        <CustomSearchBar
                          theme={theme}
                          value={searchValue}
                          onChangeText={(text) => {
                            setSearchValue(text);
                          }}
                          additionalContainerStyle={[
                            styles.searchContainer,
                            isSearchOpen ? styles.borderLight : undefined,
                          ]}
                          rightIcon={
                            <Icon
                              name={Icons.SEARCH}
                              theme={theme}
                              width={18}
                              height={18}
                              onPress={() => {
                                setSearchValue('');
                                setIsSearchOpen(false);
                              }}
                            />
                          }
                        />
                      ) : (
                        <>
                          <Icon
                            name={Icons.SEARCH}
                            theme={theme}
                            additionalContainerStyle={styles.search}
                            onPress={() => {
                              setIsSearchOpen(true);
                            }}
                            width={18}
                            height={18}
                          />
                          <Icon
                            name={Icons.SETTINGS_2}
                            theme={theme}
                            onPress={handleClickSettings}
                          />
                        </>
                      )}
                    </View>
                  </View>
                  {filteredUserTokenBalanceList.map((item, index) => (
                    <EngineTokenDisplay
                      key={`engine-token-${item._id}`}
                      addBackground
                      token={item}
                      tokensList={tokens}
                      market={tokensMarket}
                      toggled={toggled === item._id}
                      setToggle={() => {
                        if (toggled === item._id) setToggled(null);
                        else setToggled(item._id);
                        handleClickToView(index, 1);
                      }}
                    />
                  ))}

                  <>
                    {isHiveEngineLoading && (
                      <View style={styles.extraContainerMiniLoader}>
                        <Loader size={'small'} animating />
                      </View>
                    )}
                    {!userTokens.loading &&
                      filteredUserTokenBalanceList.length === 0 &&
                      orderedUserTokenBalanceList.length === 0 && (
                        <View style={styles.extraContainerMiniLoader}>
                          <Text style={styles.no_tokens}>
                            {translate('wallet.no_tokens')}
                          </Text>
                        </View>
                      )}
                    {!userTokens.loading &&
                      orderedUserTokenBalanceList.length > 0 &&
                      filteredUserTokenBalanceList.length === 0 && (
                        <View style={styles.extraContainerMiniLoader}>
                          <Text style={styles.no_tokens}>
                            {translate('wallet.no_tokens_filter')}
                          </Text>
                        </View>
                      )}
                  </>
                </View>
                <View style={[getCardStyle(theme).filledWrapper]} />
              </ScrollView>
            </View>
            <WhatsNew navigation={navigation} />
            <WidgetConfiguration
              show={showWidgetConfiguration}
              setShow={setShowWidgetConfiguration}
            />
            <TutorialPopup navigation={navigation} />
          </View>
        ) : (
          <Loader animatedLogo />
        )}
        <ProposalVotingSectionComponent loaded={!loadingUserAndGlobals} />
      </>
    </WalletPage>
  );
};

const getDimensionedStyles = (
  {width, height}: Dimensions,
  theme: Theme,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    paddingVertical: {paddingVertical: 10},
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 4,
      paddingVertical: 8,
    },
    rowWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.05,
    },
    avatar: {width: 25, height: 25, borderRadius: 50},
    headerMenu: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      zIndex: 20,
    },
    innerHeader: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
    },
    dropdownContainer: {
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 150 : 180,
      alignSelf: 'flex-end',
    },
    marginRight: {
      marginRight: width * 0.05,
    },
    search: {
      marginRight: 10,
    },
    separatorContainer: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      height: 1,
      backgroundColor: getColors(theme).separatorBgColor,
      marginHorizontal: 10,
      width: '75%',
      flexShrink: 1,
    },
    borderLight: {
      borderColor: getColors(theme).cardBorderColor,
      borderWidth: 1,
    },
    searchContainer: {
      position: 'absolute',
      right: 0,
      zIndex: 10,
      height: 45,
    },
    extraContainerMiniLoader: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      height: 150,
      paddingTop: 30,
      zIndex: 11,
    },
    no_tokens: {
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      ...button_link_primary_medium,
    },
    filledWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownOverlay: {
      paddingHorizontal: 0,
      paddingRight: width * 0.05,
    },
    smallIcon: {width: 10, height: 10},
    dropdownExpandedContainer: {
      alignSelf: 'flex-end',
      width: '65%',
    },
    userdropdown: {
      backgroundColor: '#ffffff00',
      borderWidth: 1,
      borderColor:
        theme === Theme.LIGHT ? NEUTRAL_WHITE_COLOR : DARKBLUELIGHTER,
      borderRadius: 11,
      paddingHorizontal: 6,
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
      rpc: state.settings.rpc,
    };
  },
  {
    loadAccount,
    loadProperties,
    loadPrices,
    fetchPhishingAccounts,
    loadTokens,
    loadTokensMarket,
    showFloatingBar,
    setIsDrawerOpen,
    setisLoadingScreen,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Main);
