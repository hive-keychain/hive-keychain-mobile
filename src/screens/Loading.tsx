import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import React, {useContext} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ThemeContext} from 'src/context/theme.context';

const Loading = () => {
  const {theme} = useContext(ThemeContext);
  const {width} = useWindowDimensions();
  return (
    <Background theme={theme} containerStyle={styles.bgd}>
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
