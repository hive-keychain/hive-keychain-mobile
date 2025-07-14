import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {
  Edge,
  initialWindowMetrics,
  SafeAreaView,
} from 'react-native-safe-area-context';

type Props = {
  style?: StyleProp<ViewStyle>;
  skipTop?: boolean;
  skipBottom?: boolean;
  children: JSX.Element | JSX.Element[];
};

const SafeArea = ({style, children, skipTop, skipBottom}: Props) => {
  const edges: Edge[] = ['left', 'right'];
  if (!skipTop) {
    edges.push('top');
  }
  if (!skipBottom) {
    edges.push('bottom');
  }
  return (
    <SafeAreaView
      style={[
        style,
        {
          paddingBottom: !skipBottom ? 0 : initialWindowMetrics.insets.bottom,
          paddingTop: skipTop ? 16 : 12,
        },
      ]}
      edges={edges}>
      {children}
    </SafeAreaView>
  );
};

export default SafeArea;
