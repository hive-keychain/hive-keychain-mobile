import * as React from 'react';
import {StatusBar, Platform, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default (props) => {
  const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;

  if (!useIsFocused()) {
    return null;
  }
  return <StatusBar {...props} />;
  // switch (Platform.OS) {
  //   case 'android':
  //     return <StatusBar {...props} />;
  //   case 'ios':
  //     return (
  //       <View
  //         style={{
  //           width: '100%',
  //           height: STATUS_BAR_HEIGHT,
  //           backgroundColor: props.backgroundColor,
  //         }}>
  //         <StatusBar barStyle="light-content" />
  //       </View>
  //     );
  // }
};
