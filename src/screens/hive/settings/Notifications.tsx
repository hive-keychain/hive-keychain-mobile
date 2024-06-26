import CheckBoxPanel from 'components/form/CheckBoxPanel';
import UserDropdown from 'components/form/UserDropdown';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import {PeakDNotificationsUtils} from 'utils/peakd-notifications.utils';

//TODO to erase after finishing feature
//  if you decide to use SSE, please comment lines 40 until 47 in android/app/src/debug/java/com/mobilekeychain/ReactNativeFlipper.java
//  known issue: https://github.com/facebook/flipper/issues/2495
//  -> this allows you to work with SSE connections in dev mode.

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
    <Background theme={theme}>
      {ready ? (
        <View style={styles.container}>
          <Caption text={'settings.settings.notifications.disclaimer'} />
          <Separator />
          <FocusAwareStatusBar />
          <UserDropdown />
          <Separator />
          <CheckBoxPanel
            checked={isActive}
            onPress={() => {}}
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
