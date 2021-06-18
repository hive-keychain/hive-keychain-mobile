import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {StatusBar, StatusBarProps} from 'react-native';

export default (props: StatusBarProps) => {
  if (!useIsFocused()) {
    return null;
  } else {
    return <StatusBar {...props} />;
  }
};
