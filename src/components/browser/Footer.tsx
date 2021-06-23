import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  canGoBack: boolean;
  goBack: () => void;
  canGoForward: boolean;
  goForward: () => void;
  goHome: () => void;
  reload: () => void;
  toggleSearchBar: () => void;
  manageTabs: () => void;
  height: number;
};
const Footer = ({
  canGoBack,
  goBack,
  canGoForward,
  goForward,
  goHome,
  reload,
  toggleSearchBar,
  //addTab,
  manageTabs,
  height,
}: Props) => {
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
      <TouchableOpacity onPress={manageTabs}>
        <Icon name="tab" style={styles.icon} />
      </TouchableOpacity>
      {
        //<TouchableOpacity onPress={addTab}>
        //<Icon name="add" style={styles.icon} />
        //</TouchableOpacity>
      }
    </View>
  );
};

const getStyles = (height: number, insets: EdgeInsets) =>
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
    },
  });

export default Footer;
