import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import React from 'react';
import {StyleSheet} from 'react-native';

type Props = {
  children: JSX.Element;
};

export default ({children}: Props) => {
  return (
    <SafeArea style={styles.bgd}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#A3112A" />
      {children}
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%', backgroundColor: 'white'},
});
