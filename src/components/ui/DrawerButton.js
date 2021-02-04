import React from 'react';
import {StyleSheet} from 'react-native';
import Menu from 'assets/wallet/menu.svg';

export default ({navigation}) => (
  <>
    <Menu
      width={25}
      height={25}
      style={styles.menu}
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  </>
);

const styles = StyleSheet.create({
  menu: {marginRight: 15},
});
