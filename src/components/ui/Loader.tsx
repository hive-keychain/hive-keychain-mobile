import React from 'react';
import {ActivityIndicator} from 'react-native';

interface Props {
  color?: string;
  size?: 'small' | 'large' | number;
  animating?: boolean;
}
export default ({
  color = '#E31337',
  size = 'large',
  animating = false,
}: Props) => {
  return <ActivityIndicator color={color} size={size} animating={animating} />;
};
