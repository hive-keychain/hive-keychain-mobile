import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Menu from 'assets/wallet/menu.svg';

export default ({navigation}) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => {
      navigation.openDrawer();
    }}>
    <Menu width={25} height={25} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: 50,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  menu: {},
});
