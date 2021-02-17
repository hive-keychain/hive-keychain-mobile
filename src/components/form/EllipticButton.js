import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Loader from 'components/ui/Loader';

export default ({style, isLoading, title, ...props}) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  return !isLoading ? (
    <TouchableOpacity {...props} style={[styles.button, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  ) : (
    <View style={[style, styles.loader]}>
      <Loader animating={isLoading} />
    </View>
  );
};

const getDimensionedStyles = ({width, height}) => {
  return StyleSheet.create({
    text: {color: 'white', fontSize: 16},
    button: {
      marginHorizontal: width * 0.1,
      width: '80%',
      color: 'black',
      backgroundColor: 'black',
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loader: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });
};
