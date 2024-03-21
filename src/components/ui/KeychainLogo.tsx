import KeychainIcon from 'assets/keychain.svg';
import KeychainLogoPoweredDark from 'assets/new_UI/keychain_logo_powered_dark_theme.svg';
import KeychainLogoPoweredLight from 'assets/new_UI/keychain_logo_powered_light_theme.svg';
import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';

interface Props {
  style?: StyleProp<ViewStyle>;
  width: number;
  theme: Theme;
  using_new_ui?: boolean;
}

const KeychainLogo = ({style, width, using_new_ui, theme}: Props) => {
  const styles = getDimensionedStyles({width});
  return using_new_ui ? (
    theme === Theme.LIGHT ? (
      <KeychainLogoPoweredLight />
    ) : (
      <KeychainLogoPoweredDark />
    )
  ) : (
    <View style={[styles.blackCircle, style]}>
      <KeychainIcon {...styles.image} />
    </View>
  );
};

const getDimensionedStyles = ({width}: {width: number}) =>
  StyleSheet.create({
    blackCircle: {
      width: width,
      height: width,
      backgroundColor: 'black',
      borderRadius: width * 0.5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {width: width * 0.5, height: ((width * 0.5) / 49) * 41},
  });

export default KeychainLogo;
