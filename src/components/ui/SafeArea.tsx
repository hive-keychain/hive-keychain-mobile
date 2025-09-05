import React from 'react';
import {Platform, StyleProp, ViewStyle} from 'react-native';
import {
  Edge,
  initialWindowMetrics,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {useOrientation} from 'src/context/orientation.context';

type Props = {
  style?: StyleProp<ViewStyle>;
  skipTop?: boolean;
  skipBottom?: boolean;
  children: React.ReactNode | React.ReactNode[];
};

const SafeArea = ({style, children, skipTop, skipBottom}: Props) => {
  const orientation = useOrientation();
  const edges: Edge[] = ['left', 'right'];
  if (!skipTop) {
    edges.push('top');
  }
  if (!skipBottom) {
    edges.push('bottom');
  }

  const isAndroid35 = Platform.OS === 'android' && Platform.Version >= 35;
  const applyPadding = (child: React.ReactNode) => {
    if (!isAndroid35) {
      return React.cloneElement(child as React.ReactElement<any>, {
        style: [
          (child as React.ReactElement<any>).props.style,
          {
            paddingBottom: !skipBottom ? 0 : initialWindowMetrics.insets.bottom,
          },
        ],
      });
    } else {
      return child;
    }
  };

  return (
    <SafeAreaView
      style={[
        {
          paddingTop: skipTop ? 16 : 12,
          paddingBottom:
            skipBottom && isAndroid35 && !orientation.startsWith('LANDSCAPE')
              ? initialWindowMetrics.insets.bottom
              : 0,
        },
        style,
      ]}
      edges={edges}>
      {Array.isArray(children)
        ? children.map((child: React.ReactNode, index) =>
            index === children.length - 1 ? applyPadding(child) : child,
          )
        : applyPadding(children as React.ReactNode)}
    </SafeAreaView>
  );
};

export default SafeArea;
