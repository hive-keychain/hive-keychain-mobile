import CloseIconDark from 'assets/new_UI/close_circle_dark.svg';
import CloseIconLight from 'assets/new_UI/close_circle_light.svg';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
  onPress: () => void;
};

export default function CloseButton({theme, onPress}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      {theme === Theme.LIGHT ? <CloseIconLight /> : <CloseIconDark />}
    </TouchableOpacity>
  );
}
