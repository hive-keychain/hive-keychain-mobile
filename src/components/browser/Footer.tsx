import {useFocusEffect} from '@react-navigation/native';
import Icon from 'components/hive/Icon';
import React from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import {Theme} from 'src/context/theme.context';
import {
  BACKGROUNDITEMDARKISH,
  HIVEICONBGCOLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {body_primary_body_2} from 'src/styles/typography';

type Props = {
  canGoBack: boolean;
  goBack: () => void;
  canGoForward: boolean;
  goForward: () => void;
  reload: () => void;
  clearCache: () => void;
  manageTabs: () => void;
  height: number;
  addTab: () => void;
  tabs: number;
  theme: Theme;
};
const Footer = ({
  canGoBack,
  goBack,
  canGoForward,
  goForward,
  reload,
  addTab,
  manageTabs,
  height,
  tabs,
  clearCache,
  theme,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(height, insets, theme);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (canGoBack) goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [canGoBack]),
  );

  return (
    <View style={styles.footer}>
      <Icon
        theme={theme}
        name="arrow_left_browser"
        {...styles.icon}
        color={canGoBack ? getColors(theme).icon : '#555'}
        onClick={goBack}
      />
      <Icon
        theme={theme}
        name="arrow_right_browser"
        {...styles.icon}
        color={canGoForward ? getColors(theme).icon : '#555'}
        onClick={goForward}
      />
      <Icon
        theme={theme}
        name="add_browser"
        additionalContainerStyle={[styles.circleContainer]}
        onClick={addTab}
        // width={35}
        // height={35}
        {...styles.icon}
      />
      <Icon
        theme={theme}
        name="rotate_right_browser"
        onClick={reload}
        onLongPress={() => {
          clearCache();
          SimpleToast.show('Cache cleared');
          reload();
        }}
        {...styles.icon}
      />
      <TouchableOpacity onPress={manageTabs}>
        <View style={styles.manage}>
          <Text
            style={[
              styles.textBase,
              theme === Theme.LIGHT ? styles.redColor : undefined,
            ]}>
            {tabs}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
//TODO clear styles & unused
const getStyles = (height: number, insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    icon: {width: 20, height: 20},
    disabled: {color: 'darkgrey'},
    footer: {
      height: height || 40,
      paddingBottom: insets.bottom,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    manage: {
      borderColor: getColors(theme).icon,
      borderWidth: 1,
      width: 28,
      height: 28,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      flex: 2,
      textAlign: 'center',
      color: '#838383',
    },
    circleContainer: {
      padding: 2,
      borderRadius: 50,
      backgroundColor:
        theme === Theme.LIGHT ? HIVEICONBGCOLOR : BACKGROUNDITEMDARKISH,
      width: 30,
      height: 30,
      borderColor: getColors(theme).borderContrast,
      borderWidth: 1,
    },
    textBase: {
      ...body_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    redColor: {
      color: PRIMARY_RED_COLOR,
    },
  });

export default Footer;
