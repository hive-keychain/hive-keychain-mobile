import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Footer = ({
  canGoBack,
  goBack,
  canGoForward,
  goForward,
  goHome,
  reload,
  toggleSearchBar,
  addTab,
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={goBack}>
        <Icon
          name="keyboard-arrow-left"
          style={[styles.icon, !canGoBack && styles.disabled]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={goForward}>
        <Icon
          name="keyboard-arrow-right"
          style={[styles.icon, !canGoForward && styles.disabled]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={goHome}>
        <Icon name="home" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSearchBar}>
        <Icon name="search" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={reload}>
        <Icon name="refresh" style={styles.icon} />
      </TouchableOpacity>
      {
        //<TouchableOpacity onPress={addTab}>
        //<Icon name="add" style={styles.icon} />
        //</TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {color: 'white', fontSize: 35},
  disabled: {color: 'darkgrey'},
  footer: {
    height: 60,
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Footer;
