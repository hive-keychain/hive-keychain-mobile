import CheckBoxPanel from 'components/form/CheckBoxPanel';
import UserDropdown from 'components/form/UserDropdown';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import {navigate} from 'utils/navigation';
import {PeakDNotificationsUtils} from 'utils/notifications.utils';

const Notifications = ({active}: PropsFromRedux) => {
  const [isActive, setActive] = useState(false);
  const [userHasConfig, setUserHasConfig] = useState<boolean>();
  const [ready, setReady] = useState(false);

  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useEffect(() => {
    if (active && active.name) init(active.name);
  }, [active]);

  const init = async (username: string) => {
    const userConfig = await PeakDNotificationsUtils.getAccountConfig(username);
    setUserHasConfig(!!userConfig);
    setActive(!!userConfig);
    setReady(true);
  };

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      {ready ? (
        <View style={styles.container}>
          <Caption text={'settings.settings.notifications.disclaimer'} />
          <Separator />
          <FocusAwareStatusBar />
          <UserDropdown />
          <Separator />
          <CheckBoxPanel
            checked={isActive}
            onPress={async () => {
              if (!isActive) {
                await PeakDNotificationsUtils.saveDefaultConfig(active);
              } else {
                setReady(false);
                await PeakDNotificationsUtils.deleteAccountConfig(active);
              }
              navigate('WalletScreen');
            }}
            title="settings.settings.notifications.activated"
          />
        </View>
      ) : (
        <View style={styles.centered}>
          <Loader animating />
        </View>
      )}
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
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
  });

const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Notifications);
