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
import {Account} from 'actions/interfaces';
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
import {VestingRoutesPopup} from 'components/popups/vesting-routes/VestingRoutes';
import {AccountVestingRoutesDifferences} from 'components/popups/vesting-routes/vesting-routes.interface';
import WhatsNew from 'components/popups/whats-new/WhatsNew';
import WidgetConfiguration from 'components/popups/widget-configuration/WidgetConfiguration';
import WrongKeyPopup, {
  WrongKeysOnUser,
} from 'components/popups/wrong-key/WrongKeyPopup';
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
import {KeyUtils} from 'utils/key.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {VestingRoutesUtils} from 'utils/vesting-routes.utils';
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

  const [vestingRoutesDifferences, setVestingRoutesDifferences] = useState<
    AccountVestingRoutesDifferences[] | undefined
  >();

  //TODO below move all of this to C:\Users\saturno\Downloads\Keychain\hive-keychain-mobile\src\components\popups\wrong-key\WrongKeyPopup.tsx
  const [displayWrongKeyPopup, setDisplayWrongKeyPopup] = useState<
    WrongKeysOnUser | undefined
  >();

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
      initCheckVestingRoutes();
      initCheckKeysOnAccounts(accounts);
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

  const initCheckVestingRoutes = async () => {
    const tempVestingRoutesDifferences = await VestingRoutesUtils.getWrongVestingRoutes(
      accounts,
    );
    setVestingRoutesDifferences(tempVestingRoutesDifferences);
  };

  //TODO below move all of this to C:\Users\saturno\Downloads\Keychain\hive-keychain-mobile\src\components\popups\wrong-key\WrongKeyPopup.tsx
  const initCheckKeysOnAccounts = async (localAccounts: Account[]) => {
    try {
      const accountNames = localAccounts.map((acc) => acc.name!);
      //TODO line below uncomment when ready
      // const extendedAccountsList = await AccountUtils.getAccounts(accountNames);

      //TODO below line remove after tests & finished
      const extendedAccountsList = [
        {
          active: {
            account_auths: [],
            key_auths: [
              [
                'STM6GqXywte487TZbn6RuTWRfa3gDLVvpWxxdNgmurnp9jjaXuVhs', //originally as STM6GqXywte487TZbn6RuTWRfa3gDLVvpWxxdNgmurnp9jjaXuVh6
                1,
              ],
            ],
            weight_threshold: 1,
          },
          balance: '3.595 HIVE',
          can_vote: true,
          comment_count: 0,
          created: '2021-02-10T12:57:15',
          curation_rewards: 0,
          delayed_votes: [],
          delegated_vesting_shares: '8733.947850 VESTS',
          downvote_manabar: {
            current_mana: 18484400219,
            last_update_time: 1709730807,
          },
          governance_vote_expiration_ts: '2025-01-15T12:53:27',
          guest_bloggers: [],
          hbd_balance: '0.389 HBD',
          hbd_last_interest_payment: '1970-01-01T00:00:00',
          hbd_seconds: '0',
          hbd_seconds_last_update: '1970-01-01T00:00:00',
          id: 1435324,
          json_metadata:
            '{"beneficiaries":[{"name":"tipu","weight":100,"label":"creator"},{"name":"hiveonboard","weight":100,"label":"provider"}]}',
          last_account_recovery: '1970-01-01T00:00:00',
          last_account_update: '2024-07-12T22:16:45',
          last_owner_update: '2024-07-12T22:16:45',
          last_post: '2021-05-26T18:07:51',
          last_root_post: '2021-05-26T18:07:51',
          last_vote_time: '1970-01-01T00:00:00',
          lifetime_vote_count: 0,
          market_history: [],
          memo_key: 'STM5Q7VEj5AA3DGjVsKaHPGGtCZFnboZMWfUvz3gXS4KjHsh2Lz4X', //originally as STM5Q7VEj5AA3DGjVsKaHPGGtCZFnboZMWfUvz3gXS4KjHsh2LzsX
          mined: false,
          name: 'jobaboard',
          next_vesting_withdrawal: '1969-12-31T23:59:59',
          open_recurrent_transfers: 0,
          other_history: [],
          owner: {
            account_auths: [],
            key_auths: [
              ['STM8EbEj1URdzDHF75MGT876A7yLrY3C7jGfyYvGAnzBjuRnmBN1j', 1],
            ],
            weight_threshold: 1,
          },
          pending_claimed_accounts: 0,
          pending_transfers: 0,
          post_bandwidth: 0,
          post_count: 2,
          post_history: [],
          post_voting_power: '70469.287092 VESTS',
          posting: {
            account_auths: [['jobaboard', 1]],
            key_auths: [
              [
                'STM821E6LnkCsM7cK5Aupv2LNtbhRZUA3vF6vtvgk8J5N3EWrpXA2', //originally as STM821E6LnkCsM7cK5Aupv2LNtbhRZUA3vF6vtvgk8J5N3EWrpXA7
                1,
              ],
            ],
            weight_threshold: 1,
          },
          posting_json_metadata:
            '{"beneficiaries":[{"name":"tipu","weight":100,"label":"creator"},{"name":"hiveonboard","weight":100,"label":"provider"}],"profile":{"is_public":true,"redirect_uris":["https://jobaboard.net/callbackhs"],"type":"app","name":"jobaboard","profile_image":"https://images.hive.blog/DQmeH5eQzuRJsgnzHaGZfojFJdKtsibyM6tAaW5haP8Whep/final-square.png","location":"Internet - Worldwide","creator":"theghost1980","version":2,"about":"Job Board using NFTs & Marketplace","website":"https://jobaboard.net/"}}',
          posting_rewards: 7200,
          previous_owner_update: '1970-01-01T00:00:00',
          proxied_vsf_votes: [0, 0, 0, 0],
          proxy: '',
          received_vesting_shares: '0.000000 VESTS',
          recovery_account: 'tipu',
          reputation: 0,
          reset_account: 'null',
          reward_hbd_balance: '0.000 HBD',
          reward_hive_balance: '0.000 HIVE',
          reward_vesting_balance: '0.000000 VESTS',
          reward_vesting_hive: '0.000 HIVE',
          savings_balance: '0.000 HIVE',
          savings_hbd_balance: '0.070 HBD',
          savings_hbd_last_interest_payment: '2024-01-02T13:14:09',
          savings_hbd_seconds: '22200',
          savings_hbd_seconds_last_update: '2024-01-02T13:18:09',
          savings_withdraw_requests: 0,
          tags_usage: [],
          to_withdraw: 0,
          transfer_history: [],
          vesting_balance: '0.000 HIVE',
          vesting_shares: '79203.234942 VESTS',
          vesting_withdraw_rate: '0.000000 VESTS',
          vote_history: [],
          voting_manabar: {
            current_mana: 73937600875,
            last_update_time: 1709730807,
          },
          voting_power: 0,
          withdraw_routes: 0,
          withdrawn: 0,
          witness_votes: [
            'aggroed',
            'blocktrades',
            'cedricguillas',
            'someguy123',
            'stoodkev',
            'therealwolf',
          ],
          witnesses_voted_for: 6,
        },
        {
          active: {
            account_auths: [],
            key_auths: [
              ['STM5xNkK85w6KCGsrFrBFTAK5eGuJDVcc1RAfYWQ7AdFFGPckE5VW', 1],
            ],
            weight_threshold: 1,
          },
          balance: '0.730 HIVE',
          can_vote: true,
          comment_count: 0,
          created: '2022-05-13T06:58:45',
          curation_rewards: 0,
          delayed_votes: [
            {
              time: '2024-06-27T19:33:00',
              val: 859749093,
            },
          ],
          delegated_vesting_shares: '15560.112484 VESTS',
          downvote_manabar: {
            current_mana: 12110938938,
            last_update_time: 1719570897,
          },
          governance_vote_expiration_ts: '2025-06-17T13:19:12',
          guest_bloggers: [],
          hbd_balance: '0.000 HBD',
          hbd_last_interest_payment: '1970-01-01T00:00:00',
          hbd_seconds: '0',
          hbd_seconds_last_update: '1970-01-01T00:00:00',
          id: 2394985,
          json_metadata: '{}',
          last_account_recovery: '1970-01-01T00:00:00',
          last_account_update: '2024-06-27T19:31:45',
          last_owner_update: '2023-08-23T14:26:12',
          last_post: '2024-06-28T10:33:36',
          last_root_post: '2023-03-15T13:18:57',
          last_vote_time: '2024-06-28T10:34:57',
          lifetime_vote_count: 0,
          market_history: [],
          memo_key: 'STM7BxD7iUz5g32d2Qki85NxSYCdSfcj37T2dSv2STpDZR8VB7bth',
          mined: false,
          name: 'keychain.tests',
          next_vesting_withdrawal: '1969-12-31T23:59:59',
          open_recurrent_transfers: 0,
          other_history: [],
          owner: {
            account_auths: [],
            key_auths: [
              ['STM8CRoMWjNd1w7emWHRefVnPZuYiRFUXx5mBSSuC2bqjFRxj38v5', 1],
            ],
            weight_threshold: 1,
          },
          pending_claimed_accounts: 14,
          pending_transfers: 0,
          post_bandwidth: 0,
          post_count: 10,
          post_history: [],
          post_voting_power: '48443.755755 VESTS',
          posting: {
            account_auths: [
              ['ecency.app', 1],
              ['keychain.tests', 1],
              ['www.waivio.com', 1],
            ],
            key_auths: [
              ['STM6t8v1KbMDjKnvKT5BcBioopuRDuxA9CWTEHcRxfFspKZhWN2wk', 1],
            ],
            weight_threshold: 1,
          },
          posting_json_metadata:
            '{"profile":{"profile_image":"https://files.peakd.com/file/peakd-hive/keychain.tests/keychain_tests.png","version":2,"location":"https://hive-keychain.com/","name":"keychain wallet tests account"}}',
          posting_rewards: 0,
          previous_owner_update: '1970-01-01T00:00:00',
          proxied_vsf_votes: [0, 0, 0, 0],
          proxy: '',
          received_vesting_shares: '18028.209022 VESTS',
          recovery_account: 'stoodkev',
          reputation: 0,
          reset_account: 'null',
          reward_hbd_balance: '0.000 HBD',
          reward_hive_balance: '0.000 HIVE',
          reward_vesting_balance: '0.000000 VESTS',
          reward_vesting_hive: '0.000 HIVE',
          savings_balance: '0.013 HIVE',
          savings_hbd_balance: '1.118 HBD',
          savings_hbd_last_interest_payment: '2024-02-26T10:46:48',
          savings_hbd_seconds: '0',
          savings_hbd_seconds_last_update: '2024-02-26T10:46:48',
          savings_withdraw_requests: 0,
          tags_usage: [],
          to_withdraw: 0,
          transfer_history: [],
          vesting_balance: '0.000 HIVE',
          vesting_shares: '45975.659217 VESTS',
          vesting_withdraw_rate: '0.000000 VESTS',
          vote_history: [],
          voting_manabar: {
            current_mana: 47474880639,
            last_update_time: 1719570897,
          },
          voting_power: 9799,
          withdraw_routes: 0,
          withdrawn: 0,
          witness_votes: ['arcange', 'good-karma', 'stoodkev'],
          witnesses_voted_for: 3,
        },
      ];

      let noKeyCheck: WrongKeysOnUser = JSON.parse(
        await AsyncStorage.getItem(KeychainStorageKeyEnum.NO_KEY_CHECK),
      );
      console.log({noKeyCheck}); //TODO remove line
      if (!noKeyCheck) {
        noKeyCheck = {[localAccounts[0].name!]: []};
      }

      const checkKeysOnAccount = (
        account: Account,
        extendedAccount: any,
        noKeyCheck: WrongKeysOnUser,
      ) => {
        const {name: accountName, keys} = account;
        let foundWrongKey: WrongKeysOnUser = {[accountName!]: []};

        if (!noKeyCheck.hasOwnProperty(accountName!)) {
          noKeyCheck = {...noKeyCheck, [accountName!]: []};
        }

        Object.entries(keys).forEach(([key, value]) => {
          if (!value.length) return;

          const isKeyInNoCheckList = !!noKeyCheck[accountName!].find(
            (keyName: string) => keyName === key.split('Pubkey')[0],
          );

          foundWrongKey = KeyUtils.checkWrongKeyOnAccount(
            key,
            value,
            accountName!,
            extendedAccount,
            foundWrongKey,
            isKeyInNoCheckList,
          );
        });

        return foundWrongKey;
      };

      for (let i = 0; i < extendedAccountsList.length; i++) {
        const account = localAccounts[i];
        const extendedAccount = extendedAccountsList[i];
        const foundWrongKey = checkKeysOnAccount(
          account,
          extendedAccount,
          noKeyCheck,
        );

        if (foundWrongKey[account.name!]?.length > 0) {
          setDisplayWrongKeyPopup(foundWrongKey);
          console.log({foundWrongKey}); //TODO remove line
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            <VestingRoutesPopup
              vestingRoutesDifferences={vestingRoutesDifferences}
              setVestingRoutesDifferences={setVestingRoutesDifferences}
              navigation={navigation}
            />
            <WrongKeyPopup
              displayWrongKeyPopup={displayWrongKeyPopup}
              setDisplayWrongKeyPopup={setDisplayWrongKeyPopup}
            />
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
