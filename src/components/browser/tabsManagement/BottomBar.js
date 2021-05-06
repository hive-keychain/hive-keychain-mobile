import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BrowserConfig} from 'utils/config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default ({
  onCloseAllTabs,
  onAddTab,
  showSideButtons,
  onQuitManagement,
}) => {
  const insets = useSafeAreaInsets();
  const styles = getsStyles(insets);
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
      <TouchableOpacity
        onPress={() => {
          onAddTab();
        }}>
        <Icon name="add-circle" style={styles.icon} />
      </TouchableOpacity>
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

const getsStyles = (insets) =>
  StyleSheet.create({
    container: {
      height: BrowserConfig.HEADER_HEIGHT + insets.bottom,
      paddingHorizontal: 20,
      paddingBottom: insets.bottom,
      backgroundColor: 'black',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    noSideButtons: {justifyContent: 'space-around'},
    icon: {color: 'white', fontSize: 30},
  });
