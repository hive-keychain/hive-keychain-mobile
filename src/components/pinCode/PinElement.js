import React from 'react';
import {StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import Backspace from 'assets/backspace.svg';

export default ({number, refNumber, helper, back, onPressElement}) => {
  const style = {};
  if (refNumber > 3) {
    style.borderTopWidth = 1;
  }
  if (refNumber < 10) {
    style.borderBottomWidth = 1;
  }
  if (refNumber % 3 !== 0) {
    style.borderRightWidth = 1;
  }
  if (refNumber % 3 !== 1) {
    style.borderLeftWidth = 1;
  }
  style.height =
    refNumber < 10
      ? Math.round(Dimensions.get('window').width * 0.25)
      : Math.round(Dimensions.get('window').width * 0.125);
  return (
    <TouchableOpacity
      disabled={refNumber === 10}
      onPress={() => onPressElement(number, back)}
      style={{...styles.pinElements, ...style}}>
      {number || number === 0 ? (
        <Text style={styles.number}>{number}</Text>
      ) : null}
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      {back ? <Backspace /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pinElements: {
    width: '30%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 0,
  },
  number: {color: 'white', fontSize: 24},
  helper: {color: 'white', fontSize: 14},
});
