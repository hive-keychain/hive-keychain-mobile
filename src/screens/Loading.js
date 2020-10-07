import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Background from 'components/ui/Background';
import KeychainLogo from 'assets/keychain.svg';

const Loading = () => {
  console.log('show loading');
  const styles = getDimensionedStyles(useWindowDimensions());
  return (
    <Background style={styles.bgd}>
      <View style={styles.blackCircle}>
        <KeychainLogo {...styles.image} />
      </View>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    bgd: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    blackCircle: {
      width: width * 0.5,
      height: width * 0.5,
      backgroundColor: 'black',
      borderRadius: width * 0.25,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {width: width * 0.25, height: ((width * 0.25) / 49) * 41},
  });

export default Loading;
