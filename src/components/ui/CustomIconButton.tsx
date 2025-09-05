import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
  onPress: () => void;
  lightThemeIcon: React.ReactNode;
  darkThemeIcon: React.ReactNode;
  additionalContainerStyle?: StyleProp<ViewStyle>;
};

export default function CustomIconButton({
  theme,
  onPress,
  lightThemeIcon,
  darkThemeIcon,
  additionalContainerStyle,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={additionalContainerStyle}
      onPress={onPress}>
      {theme === Theme.LIGHT ? lightThemeIcon : darkThemeIcon}
    </TouchableOpacity>
  );
}
