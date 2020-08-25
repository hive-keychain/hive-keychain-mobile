import React from 'react';
import {StyleSheet, View} from 'react-native';
import Background from 'components/Background';
import KeychainLogo from 'assets/keychain.svg';

const Loading = () => {
  console.log('show loading');
  return (
    <Background style={styles.bgd}>
      <View style={styles.blackCircle}>
        <KeychainLogo {...styles.image} />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  bgd: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackCircle: {
    width: 200,
    height: 200,
    backgroundColor: 'black',
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {width: 98, height: 83},
});

export default Loading;
