import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

export default (props) => {
  const {style} = props;
  console.log({...props, style: {...style, ...styles.button}});
  return (
    <Button
      {...props}
      containerViewStyle={styles.container}
      buttonStyle={{...style, ...styles.button}}
      rounded
      underlayColor={'red'}
      activeOpacity={0}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: '10%',
    color: 'black',
    backgroundColor: 'black',
    marginRight: '10%',
    width: '80%',
    height: 50,
    borderRadius: 25,
  },
});
