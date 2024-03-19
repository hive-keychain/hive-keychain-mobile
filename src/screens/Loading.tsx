import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';

const Loading = () => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  return (
    <Background theme={theme} containerStyle={styles.bgd}>
      <KeychainLogo theme={theme} width={width / 2} />
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
