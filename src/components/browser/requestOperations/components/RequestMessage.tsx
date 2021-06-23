import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default ({message}: {message: string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.msg}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingBottom: 10, paddingTop: 20},
  msg: {fontSize: 14, textAlign: 'justify'},
});
