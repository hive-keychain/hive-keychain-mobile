import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BrowserConfig} from 'utils/config';

export default ({onCloseAllTabs, onAddTab, showSideButtons}) => {
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
        <TouchableOpacity onPress={() => {}}>
          <Icon name="check" style={styles.icon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BrowserConfig.HEADER_HEIGHT,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noSideButtons: {justifyContent: 'space-around'},
  icon: {color: 'white', fontSize: 30},
});
