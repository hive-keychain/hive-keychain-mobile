import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';

const RoundButton = ({size, content, backgroundColor}) => {
  const styles = getStyleSheet(size, backgroundColor);
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>{content}</View>
    </TouchableOpacity>
  );
};

const getStyleSheet = (size, backgroundColor) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {},
  });

export default RoundButton;
