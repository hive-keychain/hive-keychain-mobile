import Clipboard from '@react-native-community/clipboard';
import AboutBGLight from 'assets/new_UI/about_background_light.svg';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
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
import SimpleToast from 'react-native-simple-toast';
import VersionInfo from 'react-native-version-info';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  body_primary_body_3,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {getSafeState} from 'store';
import {Dimensions} from 'utils/common.types';

export default ({navigation}: {navigation: AboutNavigation}) => {
  useLockedPortrait(navigation);
  const [pressed, setPressed] = useState(0);
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());
  return (
    <Background theme={theme}>
      <>
        <View style={styles.extraBg}>
          {theme === Theme.LIGHT ? <AboutBGLight /> : <AboutBGLight />}
        </View>
        <FocusAwareStatusBar />
        <Separator height={30} />
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              if (pressed < 4) {
                setPressed(pressed + 1);
              } else {
                Clipboard.setString(JSON.stringify(getSafeState()));
                SimpleToast.show(
                  'Debug Mode : The Application state has been copied to the clipboard. Contact our team to help you debug.',
                  SimpleToast.LONG,
                );
              }
            }}>
            <Text style={[styles.textBase, styles.title, styles.textCentered]}>
              Keychain Mobile v{VersionInfo.appVersion} (Beta)
            </Text>
            <Separator height={10} />
          </TouchableOpacity>
          <Text style={[styles.textBase, styles.text]}>
            Hive Keychain for mobile is developed by the Keychain team and
            founded through the <Text style={styles.highLigth}>Hive DAO</Text>.
          </Text>
          <Separator height={20} />
          <Text style={[styles.textBase, styles.text]}>
            Process transactions and enjoy your favorite dApps on your{' '}
            <Text style={styles.highLigth}>Mobile Device!</Text>
          </Text>
          <Separator height={20} />
          <Text style={[styles.textBase, styles.text]}>
            Should you encounter any issue, contact us on our{' '}
            <Text
              style={styles.highLigth}
              onPress={() => {
                Linking.openURL('https://discord.gg/3EM6YfRrGv');
              }}>
              Discord Server
            </Text>
            <Text style={[styles.textBase, styles.text]}> or </Text>
            <Text
              style={styles.highLigth}
              onPress={() => {
                Linking.openURL(
                  'https://github.com/stoodkev/hive-keychain-mobile',
                );
              }}>
              on our Github
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
      marginVertical: 10,
      paddingHorizontal: 45,
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
