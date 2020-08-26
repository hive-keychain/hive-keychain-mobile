import React from 'react';
import {Input} from 'react-native-elements';
import {StyleSheet, useWindowDimensions} from 'react-native';

export default (props) => {
  const styles = getDimensionedStyles(useWindowDimensions());
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

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'black',
      display: 'flex',
      width: '90%',
      borderRadius: height / 24,
      alignItems: 'baseline',
      height: height / 12,
    },
    leftIcon: {height: height / 15, marginRight: width / 20},
    rightIcon: {height: height / 15, marginLeft: width / 20},
    input: {color: 'white'},
    inputContainer: {
      borderBottomWidth: 0,
    },
  });
