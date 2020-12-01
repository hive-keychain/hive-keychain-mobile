import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Menu from 'assets/wallet/menu.svg';

export default ({navigation, title}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Menu
        width={25}
        height={25}
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'black',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {color: '#B9C9D6', fontSize: 18},
});
