import Clipboard from '@react-native-community/clipboard';
import AboutBGLight from 'assets/new_UI/about_background_light.svg';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {AboutNavigation} from 'navigators/MainDrawer.types';
import React, {useContext, useState} from 'react';
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
import {Theme, ThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_3,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {getSafeState} from 'store';

export default ({navigation}: {navigation: AboutNavigation}) => {
  useLockedPortrait(navigation);
  const [pressed, setPressed] = useState(0);
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme, useWindowDimensions().height);
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
            <Text style={styles.highLigth}>
              Discord Server
              <Icon
                theme={theme}
                name={Icons.EXTERNAL_LINK}
                {...styles.link}
                onClick={() => {
                  Linking.openURL('https://discord.gg/3EM6YfRrGv');
                }}
              />{' '}
              or on our Github
              <Icon
                theme={theme}
                name={Icons.EXTERNAL_LINK}
                {...styles.link}
                onClick={() => {
                  Linking.openURL(
                    'https://github.com/stoodkev/hive-keychain-mobile',
                  );
                }}
              />
            </Text>
          </Text>
        </View>
      </>
    </Background>
  );
};

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    container: {
      marginVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    link: {width: 15, height: 15},
    textBase: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
    },
    title: {
      fontSize: getFontSizeSmallDevices(height, 16),
    },
    text: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(height, 15),
    },
    textCentered: {
      textAlign: 'center',
    },
    highLigth: {
      color: getColors(theme).icon,
    },
    extraBg: {
      position: 'absolute',
    },
  });
