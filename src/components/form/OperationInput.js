import React from 'react';
import CustomInput from './CustomInput';
import {StyleSheet} from 'react-native';

export default (props) => {
  return (
    <CustomInput
      {...props}
      placeholderTextColor="#7E8C9A"
      backgroundColor="#ffffff"
      inputColor="#68A0B4"
      containerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    marginLeft: 0,
  },
});
