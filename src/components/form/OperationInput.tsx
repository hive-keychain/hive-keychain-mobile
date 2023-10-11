import React from 'react';
import {StyleSheet} from 'react-native';
import {InputProps} from 'react-native-elements';
import CustomInput from './CustomInput';

export default (props: InputProps) => {
  return (
    <CustomInput
      {...props}
      placeholderTextColor="#7E8C9A"
      backgroundColor="#ffffff"
      inputColor="#68A0B4"
      containerStyle={props.containerStyle ?? styles.container}
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
