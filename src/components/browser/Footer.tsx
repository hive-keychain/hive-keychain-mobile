import {useFocusEffect} from '@react-navigation/native';
import {showFloatingBar} from 'actions/floatingBar';
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
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {
  BACKGROUNDITEMDARKISH,
  HIVEICONBGCOLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {body_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';

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
  showFloatingBar,
  show,
}: Props & PropsFromRedux) => {
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

  return !show ? (
    <View style={styles.footer}>
      <Icon
        theme={theme}
        name="arrow_left_browser"
        {...styles.icon}
        color={canGoBack ? getColors(theme).icon : '#854343'}
        onClick={goBack}
      />
      <Icon
        theme={theme}
        name="arrow_right_browser"
        {...styles.icon}
        color={canGoForward ? getColors(theme).icon : '#854343'}
        onClick={goForward}
      />
      <Icon
        theme={theme}
        name="add_browser"
        additionalContainerStyle={[styles.circleContainer]}
        onClick={addTab}
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
      <Icon
        theme={theme}
        name="wallet_add"
        {...styles.icon}
        onClick={() => showFloatingBar(true)}
      />
    </View>
  ) : null;
};

const getStyles = (height: number, insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    icon: {width: 20, height: 20},
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
      width: 25,
      height: 25,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleContainer: {
      padding: 2,
      borderRadius: 50,
      backgroundColor:
        theme === Theme.LIGHT ? HIVEICONBGCOLOR : BACKGROUNDITEMDARKISH,
      width: 30,
      height: 30,
      borderColor: getColors(theme).icon,
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

const mapStateToProps = (state: RootState) => {
  return {
    show: state.floatingBar.show,
  };
};
const connector = connect(mapStateToProps, {
  showFloatingBar,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Footer);
