import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type FloatingCloseButtonProps = {
  closeText?: string;
  ariaLabel?: string;
  onPressHandler: () => void;
  style?: object;
};

const FloatingCloseButton = ({
  onPressHandler,
  closeText,
  ariaLabel,
  style,
}: FloatingCloseButtonProps) => {
  return (
    <TouchableOpacity
      style={style ?? defaultStyle.container}
      aria-label={ariaLabel}
      onPress={onPressHandler}>
      <Text>{closeText ?? 'X'}</Text>
    </TouchableOpacity>
  );
};

const defaultStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
});

export default FloatingCloseButton;
