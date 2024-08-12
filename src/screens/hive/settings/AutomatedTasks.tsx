import CheckBoxPanel from 'components/form/CheckBoxPanel';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import UserDropdown from 'components/form/UserDropdown';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import Spoiler from 'components/ui/Spoiler';
import SwapCurrencyImage from 'components/ui/SwapCurrencyImage';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {ICONMINDIMENSIONS} from 'src/styles/icon';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import AutomatedTasksUtils from 'utils/automatedTasks.utils';
import {ClaimsConfig} from 'utils/config';
import {translate} from 'utils/localize';

const AutomatedTasks = ({active, tokens}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
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
  const [enabledAutoStake, setEnabledAutoStake] = useState(false);
  const [autoStakeTokenList, setAutoStakeTokenList] = useState<
    DropdownModalItem[]
  >([]);
  useEffect(() => {
    setClaimAccountErrorMessage(undefined);
    setClaimSavingsErrorMessage(undefined);
    setClaimRewardsErrorMessage(undefined);
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
    setEnabledAutoStake(
      await AutomatedTasksUtils.getUserAutoStake(active.name!),
    );
  };

  const handleSetAutoStake = async (enable: boolean) => {
    setEnabledAutoStake(enable);
    await AutomatedTasksUtils.saveUserAutoStake(active.name!, enable);
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

  return (
    <Background theme={theme}>
      <ScrollView style={styles.container}>
        <Caption
          text={'settings.settings.automated_tasks.disclaimer'}
          hideSeparator
        />
        <FocusAwareStatusBar />
        <UserDropdown />
        <Separator />
        <Spoiler initiallyOpened title="HIVE">
          <>
            <CheckBoxPanel
              checked={claimRewards}
              onPress={
                claimRewardsErrorMessage
                  ? () =>
                      Toast.show(
                        translate(claimRewardsErrorMessage),
                        Toast.LONG,
                      )
                  : () => saveClaims(!claimRewards, claimAccounts, claimSavings)
              }
              containerStyle={{flexGrow: undefined}}
              title="wallet.claim.enable_autoclaim_rewards"
              subTitle="wallet.claim.enable_autoclaim_rewards_info"
            />
            <CheckBoxPanel
              checked={claimAccounts}
              onPress={
                claimAccountErrorMessage
                  ? () =>
                      Toast.show(
                        translate(claimAccountErrorMessage),
                        Toast.LONG,
                      )
                  : () => saveClaims(claimRewards, !claimAccounts, claimSavings)
              }
              title="wallet.claim.enable_autoclaim_accounts"
              containerStyle={{flexGrow: undefined}}
              subTitle={translate(
                'wallet.claim.enable_autoclaim_accounts_info',
                {
                  MIN_RC_PCT: ClaimsConfig.freeAccount.MIN_RC_PCT,
                },
              )}
              skipSubtitleTranslation
            />
            <CheckBoxPanel
              checked={claimSavings}
              containerStyle={{flexGrow: undefined}}
              onPress={
                claimSavingsErrorMessage
                  ? () =>
                      Toast.show(
                        translate(claimSavingsErrorMessage),
                        Toast.LONG,
                      )
                  : () => saveClaims(claimRewards, claimAccounts, !claimSavings)
              }
              title="wallet.claim.enable_autoclaim_savings"
              subTitle="wallet.claim.enable_autoclaim_savings_info"
            />
          </>
        </Spoiler>
        <Separator />
        <Spoiler title="Hive Engine">
          <>
            <CheckBoxPanel
              title="settings.settings.automated_tasks.he_auto.title"
              checked={enabledAutoStake}
              onPress={() => {
                handleSetAutoStake(!enabledAutoStake);
              }}
              subTitle="settings.settings.automated_tasks.he_auto.subtitle"
            />
            {enabledAutoStake && (
              <View>
                <View>
                  <DropdownModal
                    enableSearch
                    dropdownTitle="common.token"
                    dropdownIconScaledSize={ICONMINDIMENSIONS}
                    additionalDropdowContainerStyle={{paddingHorizontal: 8}}
                    selected={
                      {
                        value: undefined,
                        label: 'Select a token',
                        icon: null,
                      } as DropdownModalItem
                    }
                    onSelected={(item) => {
                      if (
                        !autoStakeTokenList?.find((a) => a.value === item.value)
                      ) {
                        const copyAutoStakeList = [...autoStakeTokenList];
                        copyAutoStakeList.unshift(item);
                        // setAndSaveAutoStakeTokenList(copyAutoStakeList);
                      }
                    }}
                    list={tokens
                      .filter((token) => token.stakingEnabled)
                      .map((token) => {
                        return {
                          value: token.symbol,
                          label: token.symbol,
                          icon: (
                            <SwapCurrencyImage
                              uri={token.metadata.icon}
                              symbol={token.symbol}
                              svgHeight={20}
                              svgWidth={20}
                            />
                          ),
                        } as DropdownModalItem;
                      })}
                    drawLineBellowSelectedItem
                    showSelectedIcon={
                      <Icon
                        name={Icons.CHECK}
                        theme={theme}
                        width={18}
                        height={18}
                        strokeWidth={2}
                        color={PRIMARY_RED_COLOR}
                      />
                    }
                    additionalLineStyle={styles.bottomLineDropdownItem}
                  />
                </View>
                <View></View>
              </View>
            )}
          </>
        </Spoiler>
        <Separator />
      </ScrollView>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1, padding: CARD_PADDING_HORIZONTAL},
    title: {
      ...title_primary_title_1,
      color: getColors(theme).primaryText,
    },
    bottomLineDropdownItem: {
      borderWidth: 1,
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
    },
  });

const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
  tokens: state.tokens,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AutomatedTasks);
