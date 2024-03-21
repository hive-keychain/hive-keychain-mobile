import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';

interface Props {
  additionalTextStyle?: StyleProp<TextStyle>;
}

export default ({message, additionalTextStyle}: {message: string} & Props) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.msg, additionalTextStyle]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingBottom: 10, paddingTop: 20},
  msg: {fontSize: 14, textAlign: 'justify'},
});
