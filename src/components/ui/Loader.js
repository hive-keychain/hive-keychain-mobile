import React from 'react';
import {ActivityIndicator} from 'react-native';

export default ({color = 'red', size = 'large', animating = false}) => {
  return <ActivityIndicator color={color} size={size} animating={animating} />;
};
