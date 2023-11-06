import {DrawerNavigationProp} from '@react-navigation/drawer';
import HamburguerMenuIconDark from 'assets/new_UI/hamburguer-menu-dark.svg';
import HamburguerMenuIconLight from 'assets/new_UI/hamburguer-menu-light.svg';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

type Props = {
  navigation: DrawerNavigationProp<any>;
  theme: Theme;
};

export default ({navigation, theme}: Props) => {
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.openDrawer();
      }}>
      {theme === Theme.LIGHT ? (
        <HamburguerMenuIconLight />
      ) : (
        <HamburguerMenuIconDark />
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: 56,
      height: 44,
      justifyContent: 'center',
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      borderColor: getColors(theme).cardBorderColorJustDark,
      backgroundColor: getColors(theme).cardBgLighter,
      borderTopRightRadius: 22,
      borderBottomRightRadius: 22,
    },
  });
