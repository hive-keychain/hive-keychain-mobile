import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaView,
} from 'react-native-safe-area-context';

type Props = {
  style?: StyleProp<ViewStyle>;
  skipTop?: boolean;
  children: JSX.Element | JSX.Element[];
};

const SafeArea = ({style, children, skipTop}: Props) => {
  return (
    <SafeAreaView
      style={[
        style,
        {
          paddingBottom: initialWindowMetrics.insets.bottom,
          paddingTop: skipTop ? 16 : 12,
        },
      ]}
      edges={skipTop ? ['left', 'right'] : ['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
};

export default SafeArea;
