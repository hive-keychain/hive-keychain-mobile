import CheckBoxPanel from 'components/form/CheckBoxPanel';
import UserDropdown from 'components/form/UserDropdown';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import {PeakDNotificationsUtils} from 'utils/peakd-notifications.utils';

const Notifications = ({active}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  //TODO cleanup
  // const [claimRewards, setClaimRewards] = useState(false);
  // const [claimAccounts, setClaimAccounts] = useState(false);
  // const [claimSavings, setClaimSavings] = useState(false);
  // const [claimSavingsErrorMessage, setClaimSavingsErrorMessage] = useState<
  //   string
  // >(undefined);
  // const [claimAccountErrorMessage, setClaimAccountErrorMessage] = useState<
  //   string
  // >(undefined);
  // const [claimRewardsErrorMessage, setClaimRewardsErrorMessage] = useState<
  //   string
  // >(undefined);

  useEffect(() => {
    if (active && active.name) init(active.name);
  }, [active]);

  const init = async (username: string) => {
    const userConfig = await PeakDNotificationsUtils.getAccountConfig(username);
    console.log({userConfig}); //TODO remove line
  };

  // const saveClaims = async (
  //   claimRewards: boolean,
  //   claimAccounts: boolean,
  //   claimSavings: boolean,
  // ) => {
  //   setClaimAccounts(claimAccounts);
  //   setClaimRewards(claimRewards);
  //   setClaimSavings(claimSavings);

  //   await AutomatedTasksUtils.saveClaims(
  //     claimRewards,
  //     claimAccounts,
  //     claimSavings,
  //     active.name!,
  //   );
  // };

  return (
    <Background theme={theme}>
      <View style={styles.container}>
        <Caption text={'settings.settings.notifications.disclaimer'} />
        <Separator />
        <FocusAwareStatusBar />
        <UserDropdown />
        <Separator />
        <CheckBoxPanel
          checked={true}
          onPress={() => {}}
          title="settings.settings.notifications.activated"
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
export default connector(Notifications);
