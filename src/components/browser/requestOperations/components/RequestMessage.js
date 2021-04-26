import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default ({message}) => {
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
