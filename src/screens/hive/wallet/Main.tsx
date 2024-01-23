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
import {DropdownItem} from 'components/form/CustomDropdown';
import {PickerItemInterface} from 'components/form/PickerItem';
import UserDropdown from 'components/form/UserDropdown';
import AccountValue from 'components/hive/AccountValue';
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
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {
  BACKGROUNDITEMDARKISH,
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
  prices,
  loadTokens,
  loadTokensMarket,
  loadUserTokens,
  showFloatingBar,
  setIsDrawerOpen,
  setisLoadingScreen,
}: PropsFromRedux & {navigation: WalletNavigation}) => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  const [loadingUserAndGlobals, setLoadingUserAndGlobals] = useState(true);
  const sectionListRef = useRef();

  useEffect(() => {
    loadTokens();
    loadTokensMarket();
  }, [loadTokens, loadTokensMarket]);

  useEffect(() => {
    if (
      properties.globals &&
      Object.keys(properties.globals).length > 0 &&
      user.name
    ) {
      setLoadingUserAndGlobals(false);
      setisLoadingScreen(false);
    }
  }, [properties, user.name]);

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

  const getItemDropDownSelected = (username: string): PickerItemInterface => {
    const selected = accounts.filter((acc) => acc.name === username)[0]!;
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  const onHandleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    showFloatingBar(event.nativeEvent.contentOffset.y === 0);
  };

  const getListFromAccount = () =>
    accounts.map((acc) => {
      return {
        label: acc.name,
        value: acc.name,
        icon: <UserProfilePicture username={acc.name} style={styles.avatar} />,
      } as DropdownItem;
    });
  //TODO commented while testing sectionList bellow
  // return (
  //   <WalletPage>
  //     {!loadingUserAndGlobals ? (
  //       <ScrollView horizontal={false} onScroll={onHandleScroll}>
  //         <Separator height={15} />
  //         <View style={[styles.headerMenu]}>
  //           <DrawerButton navigation={navigation as any} theme={theme} />
  //           <View style={[styles.innerHeader]}>
  //             <StatusIndicator theme={theme} />
  //             <Claim theme={theme} />
  //             <UserDropdown
  //               list={getListFromAccount()}
  //               selected={getItemDropDownSelected(user.name)}
  //               onSelected={(selectedAccount) => loadAccount(selectedAccount)}
  //               additionalContainerStyle={styles.dropdownContainer}
  //               additionalDropdowContainerStyle={styles.dropdownListContainer}
  //               dropdownIconScaledSize={{width: 10, height: 10}}
  //               copyButtonValue
  //             />
  //           </View>
  //         </View>
  //         <Separator />
  //         <View style={styles.rowWrapper}>
  //           <PercentageDisplay
  //             name={translate('wallet.vp')}
  //             percent={getVP(user.account) || 100}
  //             IconBgcolor={OVERLAYICONBGCOLOR}
  //             theme={theme}
  //             iconName={Icons.SEND_SQUARE}
  //             bgColor={BACKGROUNDITEMDARKISH}
  //             secondary={`$${
  //               getVotingDollarsPerAccount(
  //                 100,
  //                 properties,
  //                 user.account,
  //                 false,
  //               ) || '0'
  //             }`}
  //           />
  //           <PercentageDisplay
  //             iconName={Icons.SPEEDOMETER}
  //             bgColor={DARKER_RED_COLOR}
  //             name={translate('wallet.rc')}
  //             percent={user.rc.percentage || 100}
  //             IconBgcolor={OVERLAYICONBGCOLOR}
  //             theme={theme}
  //           />
  //         </View>
  //         <Separator />
  //         <BackgroundHexagons
  //           additionalSvgStyle={styles.extraBg}
  //           theme={theme}
  //         />
  //         <AccountValue
  //           account={user.account}
  //           prices={prices}
  //           properties={properties}
  //           theme={theme}
  //           title={translate('common.estimated_account_value')}
  //         />
  //         <Separator />
  //         <View
  //           style={[
  //             getCardStyle(theme).roundedCardItem,
  //             styles.fullListContainer,
  //           ]}>
  //           <Primary theme={theme} />
  //           <Separator height={10} />
  //           <EngineTokens showEngineTokenSettings />
  //         </View>
  //         <Survey navigation={navigation} />
  //         <WhatsNewComponent navigation={navigation} />
  //       </ScrollView>
  //     ) : (
  //       <Loader animatedLogo />
  //     )}
  //   </WalletPage>
  // );

  //TODO testing sectionList bellow
  const handleItemClick = (index: number) => {
    if (sectionListRef && sectionListRef.current) {
      (sectionListRef as any).current.scrollToLocation({
        animated: true,
        itemIndex: index,
        sectionIndex: 0,
        viewPosition: 0.5,
      });
    }
  };

  const DATA = [
    {
      title: 'Main dishes',
      data: [
        'Pizza',
        'Burger',
        'Risotto',
        'Pizza2',
        'Burger2',
        'Risotto2',
        'Pizza3',
        'Burger3',
        'Risotto3',
        'Pizza4',
        'Burger4',
        'Risotto4',
      ],
    },
    // {
    //   title: 'Sides',
    //   data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
    // },
    // {
    //   title: 'Drinks',
    //   data: ['Water', 'Coke', 'Beer'],
    // },
    // {
    //   title: '',
    //   data: ['Cheese Cake', 'Ice Cream'],
    // },
  ];
  //IMmportant //TODO
  //  - create an item token(currency | engine)
  //  - apply styles to each item to have the borders top, etc, etc, using the index.
  //  - implement within section list.
  return (
    <WalletPage
      additionalBgSvgImageStyle={
        !loadingUserAndGlobals ? {top: 80} : undefined
      }>
      {!loadingUserAndGlobals ? (
        <SectionList
          ref={sectionListRef}
          onScroll={onHandleScroll}
          ListHeaderComponent={
            <>
              <Separator height={15} />
              <View style={[styles.headerMenu]}>
                <DrawerButton navigation={navigation as any} theme={theme} />
                <View style={[styles.innerHeader]}>
                  <StatusIndicator theme={theme} />
                  <Claim theme={theme} />
                  <UserDropdown
                    list={getListFromAccount()}
                    selected={getItemDropDownSelected(user.name)}
                    onSelected={(selectedAccount) =>
                      loadAccount(selectedAccount)
                    }
                    additionalContainerStyle={styles.dropdownContainer}
                    additionalDropdowContainerStyle={
                      styles.dropdownListContainer
                    }
                    dropdownIconScaledSize={{width: 10, height: 10}}
                    copyButtonValue
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
            </>
          }
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={(item) => (
            <TouchableOpacity
              onPress={() => handleItemClick(item.index)}
              style={styles.item}>
              <Text style={{fontSize: 16}}>{item.item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Loader animatedLogo />
      )}
    </WalletPage>
  );
  //end test
};

const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    white: {color: 'white'},
    rowWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
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
    extraBg: {
      opacity: 1,
      top: 0, //TODO testing to make it fit in sectionList
    },
    fullListContainer: {
      flexGrow: 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingHorizontal: 15,
    },
    dropdownContainer: {
      width: 'auto',
      height: '100%',
      padding: 0,
    },
    dropdownListContainer: {
      borderRadius: 10,
      height: '100%',
    },
    //TODO remove bellow after implementing or testing
    item: {
      backgroundColor: '#f9c2ff5c',
      padding: 20,
      marginVertical: 8,
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
