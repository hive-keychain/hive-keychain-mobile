import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';

const Loading = () => {
  const {width} = useWindowDimensions();
  return (
    <Background containerStyle={styles.bgd}>
      <KeychainLogo width={width / 2} />
    </Background>
  );
};

const styles = StyleSheet.create({
  bgd: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
