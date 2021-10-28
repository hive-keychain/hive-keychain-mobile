import {DrawerNavigationProp} from '@react-navigation/drawer';
import Menu from 'assets/wallet/menu.svg';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  navigation: DrawerNavigationProp<any>;
};

export default ({navigation}: Props) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => {
      console.log('trying to open');
      navigation.openDrawer();
    }}>
    <Menu width={25} height={25} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  menu: {},
});
