import React from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: JSX.Element | JSX.Element[];
};

const SafeArea = ({style, children}: Props) => {
  switch (Platform.OS) {
    case 'ios':
      return <SafeAreaView style={style}>{children}</SafeAreaView>;
    default:
      return <View style={style}>{children}</View>;
  }
};

export default SafeArea;
