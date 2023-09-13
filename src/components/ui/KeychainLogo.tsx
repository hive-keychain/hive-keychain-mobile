import KeychainIcon from 'assets/keychain.svg';
import KeychainLogoPowered from 'assets/new_UI/keychain_logo_powered.svg';
import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  width: number;
  //TODO change the use of this temp var
  using_new_ui?: boolean;
}

const KeychainLogo = ({style, width, using_new_ui}: Props) => {
  const styles = getDimensionedStyles({width});
  return using_new_ui ? (
    <KeychainLogoPowered />
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
