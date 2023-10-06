import CloseIconDark from 'assets/new_UI/close_circle_dark.svg';
import CloseIconLight from 'assets/new_UI/close_circle_light.svg';
import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
  onPress: () => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
};

export default function CloseButton({
  theme,
  onPress,
  additionalContainerStyle,
}: Props) {
  return (
    <TouchableOpacity style={additionalContainerStyle} onPress={onPress}>
      {theme === Theme.LIGHT ? <CloseIconLight /> : <CloseIconDark />}
    </TouchableOpacity>
  );
}
