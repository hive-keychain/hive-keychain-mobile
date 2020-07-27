import React from 'react';
import {Input} from 'react-native-elements';
import {StyleSheet} from 'react-native';

export default (props) => {
  return (
    <Input
      placeholderTextColor="#B9C9D6"
      containerStyle={styles.container}
      inputStyle={styles.input}
      leftIconContainerStyle={styles.leftIcon}
      rightIconContainerStyle={styles.rightIcon}
      inputContainerStyle={styles.inputContainer}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    display: 'flex',
    width: '90%',
    borderRadius: 30,
    alignItems: 'baseline',
    height: 60,
  },
  leftIcon: {height: 50, marginRight: 20},
  rightIcon: {height: 50, marginLeft: 20},
  input: {color: 'white'},
  inputContainer: {
    borderBottomWidth: 0,
  },
});
