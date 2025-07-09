import React from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: JSX.Element | JSX.Element[];
  edges?: Edge[];
};

const SafeArea = ({style, children, edges}: Props) => {
  switch (Platform.OS) {
    case 'ios':
      return (
        <SafeAreaView style={style} edges={edges}>
          {children}
        </SafeAreaView>
      );
    default:
      return <View style={style}>{children}</View>;
  }
};

export default SafeArea;
