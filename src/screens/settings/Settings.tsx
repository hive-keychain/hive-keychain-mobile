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
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {RootState} from 'store';
import AutomatedTasksUtils from 'utils/automatedTasks.utils';
import {ClaimsConfig} from 'utils/config';
import {rpcList} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
//TODO next steps to work in background tasks:
//  - full check to see what error may bring changing rc from Manabar to RC type.
//  - create a background/index.ts that will run after unlock app.
//  - do we need to pass sendMessage to update the bg tasks as well?
//    - follow same as extension from there.
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
    init();
  }, [active]);

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
    console.log({disabled});
    return (
      <TouchableOpacity
        disabled={disabled}
        style={disabled ? styles.disabled : styles.enabled}>
        <>
          {children}
          {disabled && (
            <Text style={styles.warningText}>{translate(errorKeyMessage)}</Text>
          )}
        </>
      </TouchableOpacity>
    );
  };

  return (
    <SafeArea>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
      <ScrollView style={styles.view}>
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
        <Text style={styles.subtitle}>
          {' '}
          {translate('settings.settings.whitelisted')}
        </Text>
        <Separator />
        {showPreferencesHandler()}
        <Separator />
        {customDisabledComponent(
          <>
            <CheckBox
              checked={claimRewards}
              onPress={
                claimRewardsErrorMessage
                  ? () => {}
                  : () => saveClaims(!claimRewards, claimAccounts, claimSavings)
              }
              title={translate('wallet.claim.enable_autoclaim_rewards')}
              containerStyle={styles.checkbox}
              checkedColor="black"
            />
            <Text style={[styles.hintText, styles.marginBottom]}>
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
                  ? () => {}
                  : () => saveClaims(claimRewards, !claimAccounts, claimSavings)
              }
              title={translate('wallet.claim.enable_autoclaim_accounts')}
              containerStyle={styles.checkbox}
              checkedColor="black"
            />
            <Text style={[styles.hintText, styles.marginBottom]}>
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
                  ? () => {}
                  : () => saveClaims(claimRewards, claimAccounts, !claimSavings)
              }
              title={translate('wallet.claim.enable_autoclaim_savings')}
              containerStyle={styles.checkbox}
              checkedColor="black"
            />
            <Text style={[styles.hintText, styles.marginBottom]}>
              {translate('wallet.claim.enable_autoclaim_savings_info')}
            </Text>
          </>,
          !!claimSavingsErrorMessage,
          claimSavingsErrorMessage,
        )}
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
    backgroundColor: '#cccccc',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  enabled: {
    backgroundColor: '#b5b3b300',
    padding: 0,
    borderRadius: 0,
    marginBottom: 0,
  },
  warningText: {
    color: 'red',
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
