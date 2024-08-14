import CheckBoxPanel from 'components/form/CheckBoxPanel';
import UserDropdown from 'components/form/UserDropdown';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import AutomatedTasksUtils from 'utils/automatedTasks.utils';
import {ClaimsConfig} from 'utils/config';
import {translate} from 'utils/localize';
const AutomatedTasks = ({active}: PropsFromRedux) => {
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
      <View style={styles.container}>
        <Caption
          text={'settings.settings.automated_tasks.disclaimer'}
          hideSeparator
        />
        <FocusAwareStatusBar />
        <UserDropdown />
        <Separator />
        <CheckBoxPanel
          checked={claimRewards}
          onPress={
            claimRewardsErrorMessage
              ? () =>
                  Toast.show(translate(claimRewardsErrorMessage), Toast.LONG)
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
                  Toast.show(translate(claimAccountErrorMessage), Toast.LONG)
              : () => saveClaims(claimRewards, !claimAccounts, claimSavings)
          }
          title="wallet.claim.enable_autoclaim_accounts"
          containerStyle={{flexGrow: undefined}}
          subTitle={translate('wallet.claim.enable_autoclaim_accounts_info', {
            MIN_RC_PCT: ClaimsConfig.freeAccount.MIN_RC_PCT,
          })}
          skipSubtitleTranslation
        />
        <CheckBoxPanel
          checked={claimSavings}
          containerStyle={{flexGrow: undefined}}
          onPress={
            claimSavingsErrorMessage
              ? () =>
                  Toast.show(translate(claimSavingsErrorMessage), Toast.LONG)
              : () => saveClaims(claimRewards, claimAccounts, !claimSavings)
          }
          title="wallet.claim.enable_autoclaim_savings"
          subTitle="wallet.claim.enable_autoclaim_savings_info"
        />
      </View>
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
  });

const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AutomatedTasks);
