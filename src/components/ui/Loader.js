import React from 'react';
import {ActivityIndicator} from 'react-native';

export default ({color = '#E31337', size = 'large', animating = false}) => {
  return <ActivityIndicator color={color} size={size} animating={animating} />;
};
