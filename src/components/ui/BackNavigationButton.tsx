import ArrowLeftDark from 'assets/images/common-ui/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/images/common-ui/arrow_left_light.svg';
import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
  onPress: () => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
};

export default function BackNavigationButton({
  theme,
  onPress,
  additionalContainerStyle,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={additionalContainerStyle}
      onPress={onPress}>
      {theme === Theme.LIGHT ? <ArrowLeftLight /> : <ArrowLeftDark />}
    </TouchableOpacity>
  );
}
