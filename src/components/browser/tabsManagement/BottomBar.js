import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BrowserConfig} from 'utils/config';

export default () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}}>
        <Icon name="close" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Icon name="add-circle" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}}>
        <Icon name="check" style={styles.icon} />
      </TouchableOpacity>
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
  icon: {color: 'white', fontSize: 30},
});
