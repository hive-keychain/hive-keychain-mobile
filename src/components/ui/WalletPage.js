import React from 'react';
import {StyleSheet} from 'react-native';
import SafeArea from 'components/ui/SafeArea';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';

export default (props) => {
  return (
    <SafeArea style={styles.bgd}>
      <FocusAwareStatusBar backgroundColor="#A3112A" />
      {props.children}
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%', backgroundColor: 'white'},
});
