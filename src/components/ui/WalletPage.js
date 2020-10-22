import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default (props) => {
  return (
    <SafeAreaView style={styles.bgd}>
      <StatusBar backgroundColor="#A3112A" />
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%', backgroundColor: 'white'},
});
