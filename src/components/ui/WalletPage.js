import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';

export default (props) => {
  return (
    <SafeAreaView style={styles.bgd}>
      <FocusAwareStatusBar backgroundColor="#A3112A" />
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%', backgroundColor: 'white'},
});
