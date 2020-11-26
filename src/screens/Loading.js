import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';

const Loading = () => {
  const {width} = useWindowDimensions();
  return (
    <Background style={styles.bgd}>
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
