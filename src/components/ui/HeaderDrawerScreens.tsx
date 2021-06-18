import {DrawerNavigationProp} from '@react-navigation/drawer';
import Menu from 'assets/wallet/menu.svg';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  navigation: DrawerNavigationProp<any>;
  title: string;
};
export default ({navigation, title}: Props) => {
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
