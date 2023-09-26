import CloseIconDark from 'assets/new_UI/close_circle_dark.svg';
import CloseIconLight from 'assets/new_UI/close_circle_light.svg';
import React from 'react';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
};

export default function CloseButton({theme}: Props) {
  console.log('from close btn', {theme}); //TODO remove liine
  return theme === Theme.LIGHT ? <CloseIconLight /> : <CloseIconDark />;
}
