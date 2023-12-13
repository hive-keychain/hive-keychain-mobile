import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
  onPress: () => void;
  lightThemeIcon: JSX.Element;
  darkThemeIcon: JSX.Element;
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
    <TouchableOpacity style={additionalContainerStyle} onPress={onPress}>
      {theme === Theme.LIGHT ? lightThemeIcon : darkThemeIcon}
    </TouchableOpacity>
  );
}
