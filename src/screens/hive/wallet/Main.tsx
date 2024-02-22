import AsyncStorage from '@react-native-community/async-storage';
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
import {loadTokens, loadTokensMarket, loadUserTokens} from 'actions/index';
import HiveEngineLogo from 'assets/new_UI/hive-engine.svg';
import {DropdownItem} from 'components/form/CustomDropdown';
import CustomSearchBar from 'components/form/CustomSearchBar';
import DropdownModal from 'components/form/DropdownModal';
import {PickerItemInterface} from 'components/form/PickerItem';
import AccountValue from 'components/hive/AccountValue';
import CurrencyToken from 'components/hive/CurrencyToken';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Icon from 'components/hive/Icon';
import PercentageDisplay from 'components/hive/PercentageDisplay';
import StatusIndicator from 'components/hive_authentication_service/StatusIndicator';
import Claim from 'components/operations/ClaimRewards';
import DrawerButton from 'components/ui/DrawerButton';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import WalletPage from 'components/ui/WalletPage';
import {useBackButtonNavigation} from 'hooks/useBackButtonNavigate';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  SectionList,
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
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {TOPCONTAINERSEPARATION} from 'src/styles/spacing';
import {button_link_primary_medium} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {getCurrency} from 'utils/hive';
import {restartHASSockets} from 'utils/hiveAuthenticationService';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {getVP, getVotingDollarsPerAccount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
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
  loadUserTokens,
  showFloatingBar,
  setIsDrawerOpen,
  setisLoadingScreen,
  tokens,
  userTokens,
  tokensMarket,
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

  //TODO bellow testing main scroll ref
  // const [sectionListContainerYPos, setSectionListContainerYPos] = useState(0);
  const mainScrollRef = useRef();
  // const sectionListContainerRef = useRef();

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
    }
  }, [userTokens, hiddenTokens]);

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
        loadUserTokens(user.name);
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateUserWallet(lastAccount);
    });

    return unsubscribe;
  }, [navigation, lastAccount]);

  if (!user || !user.name) {
    return null;
  }

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

  const getItemDropDownSelected = (username: string): PickerItemInterface => {
    const selected = accounts.filter((acc) => acc.name === username)[0]!;
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  const onHandleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    showFloatingBar(
      event.nativeEvent.contentOffset.y === 0 ||
        event.nativeEvent.contentOffset.y < lastScrollYValue,
    );
  };

  const onHandleEndScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    setLastScrollYValue(event.nativeEvent.contentOffset.y);
  };

  const getListFromAccount = () =>
    accounts.map((acc) => {
      return {
        label: acc.name,
        value: acc.name,
        icon: <UserProfilePicture username={acc.name} style={styles.avatar} />,
      } as DropdownItem;
    });

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
        viewPosition: 0,
      });
    }
  };

  const DATA = [
    {
      title: 'Currencies',
      renderItem: ({item, index}: any) => {
        return (
          <CurrencyToken
            theme={theme}
            currencyName={getCurrency(item.currency)}
            itemIndex={index}
            onPress={() => handleClickToView(index, 0)}
          />
        );
      },
      data: [
        {currency: getCurrency('HIVE')},
        {currency: getCurrency('HBD')},
        {currency: getCurrency('HP')},
      ],
    },
    {
      title: 'Engine Tokens',
      renderItem: ({item, index}: any) => {
        return (
          <EngineTokenDisplay
            addBackground
            token={item}
            tokensList={tokens}
            market={tokensMarket}
            toggled={toggled === item._id}
            setToggle={(yPosElement: number) => {
              if (toggled === item._id) setToggled(null);
              else setToggled(item._id);
              console.log('itemCliked !', {yPosElement}); //TODO remove line
              //TODO cleanup & remove handleClickToView
              // handleClickToView(index, 1);
              //TODO bellow check if works moving the main scroll to a point.
              if (mainScrollRef && mainScrollRef.current) {
                // const finalPos = yPosElement + sectionListContainerYPos;
                // console.log({finalPos, yPosElement, sectionListContainerYPos}); //TODO remove line
                (mainScrollRef.current as any).scrollTo({
                  x: 0,
                  y: yPosElement,
                });
              }
            }}
          />
        );
      },
      data: filteredUserTokenBalanceList,
    },
  ];

  // const _measure = () => {
  //   if (sectionListContainerRef && sectionListContainerRef.current) {
  //     (sectionListContainerRef.current as any).measureInWindow(
  //       (pageX: any, pageY: any, width: any, height: any) => {
  //         console.log('sectionListContainer meassures when onLayout: ', {
  //           pageX,
  //           pageY,
  //           width,
  //           height,
  //         }); //TODO remove line
  //         setSectionListContainerYPos(pageY);
  //       },
  //     );
  //   }
  // };

  return (
    <WalletPage
      additionalBgSvgImageStyle={
        !loadingUserAndGlobals ? {top: '15%'} : undefined
      }>
      {!loadingUserAndGlobals ? (
        <ScrollView
          //TODO bellow check if works using this as main scroll
          ref={mainScrollRef}
          onScrollEndDrag={onHandleEndScroll}
          onScroll={onHandleScroll}>
          <Separator height={TOPCONTAINERSEPARATION} />
          <View style={{zIndex: 20}}>
            <View style={[styles.headerMenu]}>
              <DrawerButton navigation={navigation as any} theme={theme} />
              <View style={[styles.innerHeader]}>
                <StatusIndicator theme={theme} />
                <Claim theme={theme} />
                <View style={styles.marginRight}>
                  <DropdownModal
                    list={getListFromAccount()}
                    selected={getItemDropDownSelected(user.name)}
                    onSelected={(selectedAccount) =>
                      loadAccount(selectedAccount.value)
                    }
                    dropdownIconScaledSize={styles.smallIcon}
                    additionalDropdowContainerStyle={styles.userdropdown}
                    additionalMainContainerDropdown={[styles.dropdownContainer]}
                    additionalOverlayStyle={[styles.dropdownOverlay]}
                    additionalListExpandedContainerStyle={
                      styles.dropdownExpandedContainer
                    }
                    copyButtonValue
                    showSelectedIcon={
                      <Icon
                        name={Icons.CHECK}
                        theme={theme}
                        width={15}
                        height={15}
                        strokeWidth={2}
                        color={PRIMARY_RED_COLOR}
                      />
                    }
                  />
                </View>
              </View>
            </View>
            <Separator />
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
          </View>
          {/* //end block */}
          <View
          // ref={sectionListContainerRef}
          // onLayout={_measure}
          >
            <SectionList
              ref={sectionListRef}
              //TODO check bellow. Commented while using a ScrollView as parent of all page.
              // onScrollEndDrag={onHandleEndScroll}
              // onScroll={onHandleScroll}
              //@ts-ignore
              sections={DATA}
              keyExtractor={(item: any, index) =>
                item.currency ? item.currency + index : item.symbol + index
              }
              renderItem={({section: {renderItem}, index}) => (
                <View>{renderItem}</View>
              )}
              renderSectionHeader={({section: {title}}) =>
                title === 'Currencies' ? (
                  <View style={[getCardStyle(theme).borderTopCard]}>
                    <Separator height={25} />
                  </View>
                ) : (
                  <View style={[getCardStyle(theme).wrapperCardItem]}>
                    <View
                      style={[
                        styles.flexRow,
                        isSearchOpen ? styles.paddingVertical : undefined,
                      ]}>
                      {isSearchOpen && (
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
                              onClick={() => {
                                setSearchValue('');
                                setIsSearchOpen(false);
                              }}
                            />
                          }
                        />
                      )}
                      <HiveEngineLogo height={23} width={23} />
                      <View style={styles.separatorContainer} />
                      <Icon
                        name={Icons.SEARCH}
                        theme={theme}
                        additionalContainerStyle={styles.search}
                        onClick={() => {
                          setIsSearchOpen(!isSearchOpen);
                        }}
                        width={18}
                        height={18}
                      />
                      <Icon
                        name={Icons.SETTINGS_2}
                        theme={theme}
                        onClick={handleClickSettings}
                      />
                    </View>
                  </View>
                )
              }
              ListFooterComponent={
                <>
                  {userTokens.loading &&
                    filteredUserTokenBalanceList.length === 0 && (
                      <View style={styles.extraContainerMiniLoader}>
                        <Loader size={'small'} animating />
                      </View>
                    )}
                  {!userTokens.loading &&
                    filteredUserTokenBalanceList.length === 0 && (
                      <View
                        style={[
                          getCardStyle(theme).filledWrapper,
                          styles.filledWrapper,
                        ]}>
                        <Text style={styles.no_tokens}>
                          {translate('wallet.no_tokens')}
                        </Text>
                      </View>
                    )}
                </>
              }
            />
          </View>
          <View style={getCardStyle(theme).filledWrapper} />
        </ScrollView>
      ) : (
        <Loader animatedLogo />
      )}
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
      justifyContent: 'space-between',
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
      width: 180,
      alignSelf: 'flex-end',
    },
    marginRight: {
      marginRight: width * 0.05,
    },
    search: {
      marginRight: 4,
    },
    separatorContainer: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      height: 1,
      backgroundColor: getColors(theme).separatorBgColor,
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
      height: 100,
      alignItems: 'center',
    },
    dropdownOverlay: {
      paddingHorizontal: 0,
      paddingRight: width * 0.05,
    },
    smallIcon: {width: 10, height: 10},
    dropdownExpandedContainer: {
      width: '65%',
      alignSelf: 'flex-end',
    },
    userdropdown: {
      backgroundColor: '#ffffff00',
      borderWidth: 1,
      borderColor:
        theme === Theme.LIGHT ? NEUTRAL_WHITE_COLOR : DARKBLUELIGHTER,
      borderRadius: 11,
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
    showFloatingBar,
    setIsDrawerOpen,
    setisLoadingScreen,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Main);
