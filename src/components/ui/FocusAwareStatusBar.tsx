import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {useContext} from 'react';
import {StatusBar, StatusBarProps} from 'react-native';
import {ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

export default (props: StatusBarProps) => {
  const {theme} = useContext(ThemeContext);
  if (!useIsFocused()) {
    return null;
  } else {
    return (
      <StatusBar
        {...props}
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
    );
  }
};
