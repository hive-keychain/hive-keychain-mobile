import Icon2 from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme} from 'src/context/theme.context';
import {
  BACKGROUNDITEMDARKISH,
  HIVEICONBGCOLOR,
  getColors,
} from 'src/styles/colors';
import {BrowserConfig} from 'utils/config';

type Props = {
  onCloseAllTabs: () => void;
  onAddTab: () => void;
  showSideButtons: boolean;
  onQuitManagement: () => void;
  theme: Theme;
};

export default ({
  onCloseAllTabs,
  onAddTab,
  showSideButtons,
  onQuitManagement,
  theme,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getsStyles(insets, theme);
  return (
    <View
      style={[styles.container, showSideButtons ? null : styles.noSideButtons]}>
      {showSideButtons ? (
        <TouchableOpacity
          onPress={() => {
            onCloseAllTabs();
          }}>
          <Icon name="close" style={styles.icon} />
        </TouchableOpacity>
      ) : null}
      <Icon2
        theme={theme}
        name="add_browser"
        additionalContainerStyle={[styles.circleContainer]}
        onClick={() => {
          onAddTab();
        }}
        {...styles.icon}
      />

      {showSideButtons ? (
        <TouchableOpacity
          onPress={() => {
            onQuitManagement();
          }}>
          <Icon name="check" style={styles.icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const getsStyles = (insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    container: {
      height: BrowserConfig.HEADER_HEIGHT + insets.bottom,
      paddingHorizontal: 20,
      paddingBottom: insets.bottom,
      backgroundColor: getColors(theme).tertiaryCardBgColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    noSideButtons: {justifyContent: 'space-around'},
    icon: {color: getColors(theme).icon, fontSize: 30},
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
  });
