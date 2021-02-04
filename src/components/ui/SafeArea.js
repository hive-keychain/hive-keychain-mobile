import React from 'react';
import {View, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const SafeArea = ({style, children}) => {
  switch (Platform.OS) {
    case 'ios':
      return <SafeAreaView style={style}>{children}</SafeAreaView>;
    case 'android':
      return <View style={style}>{children}</View>;
  }
};

export default SafeArea;
