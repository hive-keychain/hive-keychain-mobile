import AboutBGLight from 'assets/images/background/about_background_light.svg';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {AboutNavigation} from 'navigators/MainDrawer.types';
import React, {useState} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-root-toast';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  body_primary_body_3,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {getSafeState} from 'store';
import {translate} from 'utils/localize';

export default ({navigation}: {navigation: AboutNavigation}) => {
  useLockedPortrait(navigation);
  const [pressed, setPressed] = useState(0);
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());
  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <>
        <View style={styles.extraBg}>{<AboutBGLight />}</View>
        <FocusAwareStatusBar />
        <Separator height={30} />
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (pressed < 4) {
                setPressed(pressed + 1);
              } else {
                Clipboard.setStringAsync(JSON.stringify(getSafeState()));
                SimpleToast.show(translate('toast.debug_state_copied'), {
                  duration: SimpleToast.durations.LONG,
                });
              }
            }}>
            <Text style={[styles.textBase, styles.title, styles.textCentered]}>
              {translate('about.title', {
                version: Constants.expoConfig?.version,
              })}
            </Text>
            <Separator height={10} />
          </TouchableOpacity>
          <Text style={[styles.textBase, styles.text]}>
            {translate('about.developed_by_prefix')}
            <Text style={styles.highLigth}>{translate('common.hive_dao')}</Text>
            .
          </Text>
          <Separator height={20} />
          <Text style={[styles.textBase, styles.text]}>
            {translate('about.process_transactions')}
            <Text style={styles.highLigth}>
              {translate('about.mobile_device_highlight')}
            </Text>
          </Text>
          <Separator height={20} />
          <Text style={[styles.textBase, styles.text]}>
            {translate('about.contact_prefix')}{' '}
            <Text
              style={styles.highLigth}
              onPress={() => {
                Linking.openURL('https://discord.gg/3EM6YfRrGv');
              }}>
              {translate('common.discord_server')}
            </Text>
            <Text style={[styles.textBase, styles.text]}>
              {' '}
              {translate('common.or')}{' '}
            </Text>
            <Text
              style={styles.highLigth}
              onPress={() => {
                Linking.openURL(
                  'https://github.com/stoodkev/hive-keychain-mobile',
                );
              }}>
              {translate('about.on_our_github')}.
            </Text>
          </Text>
        </View>
      </>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    link: {width: 15, height: 15},
    textBase: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
    },
    title: {
      fontSize: getFontSizeSmallDevices(width, 16),
    },
    text: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(width, 15),
    },
    textCentered: {
      textAlign: 'center',
    },
    highLigth: {
      color: PRIMARY_RED_COLOR,
    },
    extraBg: {
      position: 'absolute',
    },
  });
