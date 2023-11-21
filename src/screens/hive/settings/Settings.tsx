import {loadAccount} from 'actions/hive';
import {setRpc} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import {removePreference} from 'actions/preferences';
import CustomPicker from 'components/form/CustomPicker';
import UserPicker from 'components/form/UserPicker';
import CollapsibleSettings from 'components/settings/CollapsibleSettings';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {SettingsNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {RootState} from 'store';
import AutomatedTasksUtils from 'utils/automatedTasks.utils';
import {ClaimsConfig} from 'utils/config';
import {rpcList} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
//TODO afte refactoring UI, delete if not needed
const Settings = ({
  setRpc,
  settings,
  accounts,
  active,
  loadAccount,
  preferences,
  removePreference,
  navigation,
}: PropsFromRedux & {navigation: SettingsNavigation}) => {
  const [claimRewards, setClaimRewards] = useState(false);
  const [claimAccounts, setClaimAccounts] = useState(false);
  const [claimSavings, setClaimSavings] = useState(false);
  const [claimSavingsErrorMessage, setClaimSavingsErrorMessage] = useState<
    string
  >(undefined);
  const [claimAccountErrorMessage, setClaimAccountErrorMessage] = useState<
    string
  >(undefined);
  const [claimRewardsErrorMessage, setClaimRewardsErrorMessage] = useState<
    string
  >(undefined);

  useLockedPortrait(navigation);

  useEffect(() => {
    setClaimRewards(false);
    setClaimAccounts(false);
    setClaimSavings(false);
    setClaimAccountErrorMessage(undefined);
    setClaimSavingsErrorMessage(undefined);
    setClaimRewardsErrorMessage(undefined);
    init();
  }, [active.name]);

  const init = async () => {
    const values = await AutomatedTasksUtils.getClaims(active.name!);
    setClaimRewards(values[KeychainStorageKeyEnum.CLAIM_REWARDS] ?? false);
    setClaimAccounts(values[KeychainStorageKeyEnum.CLAIM_ACCOUNTS] ?? false);
    setClaimSavings(values[KeychainStorageKeyEnum.CLAIM_SAVINGS] ?? false);
    setClaimSavingsErrorMessage(
      AutomatedTasksUtils.canClaimSavingsErrorMessage(active),
    );
    setClaimAccountErrorMessage(
      AutomatedTasksUtils.canClaimAccountErrorMessage(active),
    );
    setClaimRewardsErrorMessage(
      AutomatedTasksUtils.canClaimRewardsErrorMessage(active),
    );
  };

  const saveClaims = async (
    claimRewards: boolean,
    claimAccounts: boolean,
    claimSavings: boolean,
  ) => {
    setClaimAccounts(claimAccounts);
    setClaimRewards(claimRewards);
    setClaimSavings(claimSavings);

    await AutomatedTasksUtils.saveClaims(
      claimRewards,
      claimAccounts,
      claimSavings,
      active.name!,
    );
  };

  const showPreferencesHandler = () => {
    const userPreference = preferences.find((e) => e.username === active.name);
    if (!userPreference || !userPreference.domains.length)
      return <Text>{translate('settings.settings.no_pref')}</Text>;
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{width: '100%', height: '100%'}}>
        <FlatList
          data={userPreference.domains}
          renderItem={(preference) => {
            return (
              <CollapsibleSettings
                username={active.name}
                key={preference.item.domain}
                index={preference.index}
                domainPref={preference.item}
                removePreference={removePreference}
              />
            );
          }}
        />
      </ScrollView>
    );
  };

  const customSortRpctList = (orderedRpcList: Rpc[]) => {
    if (typeof settings.rpc === 'object') {
      const selectedIndex = orderedRpcList.findIndex(
        (item) => item.uri === (settings.rpc as Rpc).uri,
      );
      const temp = orderedRpcList[0];
      orderedRpcList[0] = orderedRpcList[selectedIndex];
      orderedRpcList[selectedIndex] = temp;
    }
    return orderedRpcList;
  };

  const isClaimedAccountDisabled =
    active.rc.max_rc < ClaimsConfig.freeAccount.MIN_RC * 1.5;

  const customDisabledComponent = (
    children: JSX.Element,
    disabled: boolean,
    errorKeyMessage: string,
  ) => {
    return (
      <TouchableOpacity
        // disabled={disabled}
        style={disabled ? styles.disabled : styles.enabled}
        onPress={
          errorKeyMessage ? () => Toast.show(translate(errorKeyMessage)) : null
        }>
        <>{children}</>
      </TouchableOpacity>
    );
  };

  return (
    <SafeArea>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
      <ScrollView style={styles.view} horizontal={false}>
        <Text style={styles.title}>
          {translate('settings.settings.global')}
        </Text>
        <Text style={styles.subtitle}>
          {translate('settings.settings.rpc')}
        </Text>
        {//@ts-ignore
        translate('settings.settings.disclaimer').map((disclaimer, i) => (
          <Text key={i} style={styles.disclaimer}>
            {disclaimer}
          </Text>
        ))}
        <Separator height={20} />
        <CustomPicker
          list={customSortRpctList(rpcList)}
          onSelected={setRpc}
          selectedValue={settings.rpc}
          labelCreator={(rpc: Rpc) =>
            `${rpc.uri} ${rpc.testnet ? '(TESTNET)' : ''}`
          }
          prompt={translate('components.picker.prompt_rpc')}
        />
        <View style={styles.separator}></View>
        <Text style={[styles.title, styles.userSettings]}>
          {translate('settings.settings.user')}
        </Text>
        <UserPicker
          accounts={accounts.map((e) => e.name)}
          username={active.name}
          onAccountSelected={(account) => {
            loadAccount(account, true);
          }}
        />
        <Separator />
        {customDisabledComponent(
          <>
            <CheckBox
              checked={claimRewards}
              onPress={
                claimRewardsErrorMessage
                  ? null
                  : () => saveClaims(!claimRewards, claimAccounts, claimSavings)
              }
              title={translate('wallet.claim.enable_autoclaim_rewards')}
              containerStyle={styles.checkbox}
              checkedColor="black"
              textStyle={
                !!claimRewardsErrorMessage ? styles.disabledInfoText : null
              }
            />
            <Text
              style={[
                styles.hintText,
                styles.marginBottom,
                !!claimRewardsErrorMessage ? styles.disabledInfoText : null,
              ]}>
              {translate('wallet.claim.enable_autoclaim_rewards_info')}
            </Text>
          </>,
          !!claimRewardsErrorMessage,
          claimRewardsErrorMessage,
        )}
        {customDisabledComponent(
          <>
            <CheckBox
              checked={claimAccounts && !isClaimedAccountDisabled}
              onPress={
                claimAccountErrorMessage || isClaimedAccountDisabled
                  ? null
                  : () => saveClaims(claimRewards, !claimAccounts, claimSavings)
              }
              title={translate('wallet.claim.enable_autoclaim_accounts')}
              containerStyle={styles.checkbox}
              checkedColor="black"
              textStyle={
                isClaimedAccountDisabled || !!claimAccountErrorMessage
                  ? styles.disabledInfoText
                  : null
              }
            />
            <Text
              style={[
                styles.hintText,
                styles.marginBottom,
                isClaimedAccountDisabled || !!claimAccountErrorMessage
                  ? styles.disabledInfoText
                  : null,
              ]}>
              {translate('wallet.claim.enable_autoclaim_accounts_info', {
                MIN_RC_PCT: ClaimsConfig.freeAccount.MIN_RC_PCT,
              })}
            </Text>
          </>,
          !!claimAccountErrorMessage || isClaimedAccountDisabled,
          isClaimedAccountDisabled
            ? 'toast.claims.insufficient_hp_claim_accounts'
            : claimAccountErrorMessage,
        )}
        {customDisabledComponent(
          <>
            <CheckBox
              checked={claimSavings}
              onPress={
                claimSavingsErrorMessage
                  ? null
                  : () => saveClaims(claimRewards, claimAccounts, !claimSavings)
              }
              title={translate('wallet.claim.enable_autoclaim_savings')}
              containerStyle={styles.checkbox}
              checkedColor="black"
              textStyle={
                !!claimSavingsErrorMessage ? styles.disabledInfoText : null
              }
            />
            <Text
              style={[
                styles.hintText,
                styles.marginBottom,
                !!claimSavingsErrorMessage ? styles.disabledInfoText : null,
              ]}>
              {translate('wallet.claim.enable_autoclaim_savings_info')}
            </Text>
          </>,
          !!claimSavingsErrorMessage,
          claimSavingsErrorMessage,
        )}
        <Separator />
        <Text style={styles.subtitle}>
          {' '}
          {translate('settings.settings.whitelisted')}
        </Text>
        <Separator />
        {showPreferencesHandler()}
        <Separator />
      </ScrollView>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  separator: {borderBottomWidth: 1, paddingTop: 15},
  view: {paddingHorizontal: 20, backgroundColor: 'white'},
  title: {
    color: '#404950',
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 15,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#404950',
    fontSize: 16,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  disclaimer: {color: '#404950', marginVertical: 2},
  button: {backgroundColor: '#B9122F'},
  userSettings: {marginBottom: 0},
  checkbox: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: '100%',
    padding: 0,
    borderColor: 'rgba(0,0,0,0)',
    marginLeft: 0,
  },
  hintText: {
    fontStyle: 'italic',
  },
  marginBottom: {
    marginBottom: 8,
  },
  disabled: {
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  disabledInfoText: {
    color: '#9f9f9f',
  },
  enabled: {
    backgroundColor: '#b5b3b300',
    padding: 0,
    borderRadius: 0,
    marginBottom: 0,
  },
});

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
  accounts: state.accounts,
  active: state.activeAccount,
  preferences: state.preferences,
});
const connector = connect(mapStateToProps, {
  setRpc,
  loadAccount,
  removePreference,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Settings);
