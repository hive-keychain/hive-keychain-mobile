import React from 'react';
import {View, StyleSheet} from 'react-native';
import KeychainIcon from 'assets/keychain.svg';

const KeychainLogo = ({style, width}) => {
  const styles = getDimensionedStyles({width});
  return (
    <View style={[styles.blackCircle, style]}>
      <KeychainIcon {...styles.image} />
    </View>
  );
};

const getDimensionedStyles = ({width}) =>
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
