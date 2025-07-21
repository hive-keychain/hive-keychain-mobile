import React from 'react';
import {Platform, StyleProp, ViewStyle} from 'react-native';
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

  const isAndroid35 = Platform.OS === 'android' && Platform.Version >= 35;
  const applyPadding = (child: JSX.Element) => {
    if (!isAndroid35) {
      return React.cloneElement(child, {
        style: [
          child.props.style,
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
            skipBottom && isAndroid35 ? initialWindowMetrics.insets.bottom : 0,
        },
        style,
      ]}
      edges={edges}>
      {Array.isArray(children)
        ? children.map((child, index) =>
            index === children.length - 1 ? applyPadding(child) : child,
          )
        : applyPadding(children)}
    </SafeAreaView>
  );
};

export default SafeArea;
