import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {Button} from 'react-native-elements';

export default (props) => {
  const {style} = props;
  const styles = getDimensionedStyles(useWindowDimensions());
  return (
    <Button
      {...props}
      containerViewStyle={styles.container}
      buttonStyle={{...style, ...styles.button}}
      rounded
      underlayColor={'rgba(0,0,0,0)'}
      activeOpacity={0}
    />
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    button: {
      marginLeft: width * 0.1,
      color: 'black',
      backgroundColor: 'black',
      marginRight: width * 0.1,
      width: width * 0.8,
      height: 50,
      borderRadius: 25,
    },
  });
