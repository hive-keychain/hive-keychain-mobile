import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {ThemeContext} from 'src/context/theme.context';
import Background from './Background';

type Props = {
  children: JSX.Element;
};

export default ({children}: Props) => {
  const {theme} = useContext(ThemeContext);
  return (
    <Background using_new_ui theme={theme}>
      <SafeArea style={styles.bgd}>
        <FocusAwareStatusBar />
        {children}
      </SafeArea>
    </Background>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%'},
});
