import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Footer = ({
  canGoBack,
  goBack,
  canGoForward,
  goForward,
  goHome,
  reload,
  toggleSearchBar,
  addTab,
  height,
}) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(height, insets);

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

const getStyles = (height, insets) =>
  StyleSheet.create({
    icon: {color: 'white', fontSize: 28},
    disabled: {color: 'darkgrey'},
    footer: {
      height: height || 40,
      paddingBottom: insets.bottom,
      backgroundColor: 'black',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      elevation: 2,
    },
  });

export default Footer;
