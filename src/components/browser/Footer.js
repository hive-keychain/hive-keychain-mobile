import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Icon name="keyboard-arrow-left" style={styles.icon} />
      <Icon name="keyboard-arrow-right" style={styles.icon} />
      <Icon name="home" style={styles.icon} />
      <Icon name="search" style={styles.icon} />
      <Icon name="refresh" style={styles.icon} />
      <Icon name="add" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {color: 'white', fontSize: 35},
  footer: {
    height: 50,
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default Footer;
