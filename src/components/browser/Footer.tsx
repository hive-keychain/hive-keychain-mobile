import {useFocusEffect} from '@react-navigation/native';
import RightArrow from 'assets/browser/icon-forward.svg';
import LeftArrow from 'assets/browser/icon_back.svg';
import DesktopView from 'assets/browser/icon_desktop_view.svg';
import MovileView from 'assets/browser/icon_mobile_view.svg';
import Add from 'assets/browser/icon_new.svg';
import Refresh from 'assets/browser/icon_refresh.svg';
import React from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  canGoBack: boolean;
  goBack: () => void;
  canGoForward: boolean;
  goForward: () => void;
  reload: () => void;
  manageTabs: () => void;
  height: number;
  addTab: () => void;
  tabs: number;
  userAgentWebView: string;
  setUserAgentWebView: () => void;
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
  userAgentWebView,
  setUserAgentWebView,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(height, insets);

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
      <TouchableOpacity onPress={goBack}>
        <LeftArrow fill={canGoBack ? '#838383' : '#555'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={goForward}>
        <RightArrow fill={canGoForward ? '#838383' : '#555'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={reload}>
        <Refresh />
      </TouchableOpacity>

      <TouchableOpacity onPress={addTab}>
        <Add />
      </TouchableOpacity>
      <TouchableOpacity onPress={manageTabs}>
        <View style={styles.manage}>
          <Text style={styles.text}>{tabs}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={setUserAgentWebView}>
        {userAgentWebView === '' ? (
          <MovileView style={styles.icons_view} />
        ) : (
          <DesktopView style={styles.icons_view} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (height: number, insets: EdgeInsets) =>
  StyleSheet.create({
    icon: {color: 'white', fontSize: 28},
    disabled: {color: 'darkgrey'},
    footer: {
      height: height || 40,
      paddingBottom: insets.bottom,
      backgroundColor: 'black',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    manage: {
      borderColor: '#838383',
      borderWidth: 3,
      borderRadius: 5,
      width: 27,
      height: 27,
    },
    text: {
      flex: 2,
      textAlign: 'center',
      color: '#838383',
    },
    icons_view: {
      width: 27,
      color: 'white',
    },
  });

export default Footer;
