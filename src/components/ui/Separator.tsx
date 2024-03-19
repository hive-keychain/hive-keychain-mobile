import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

interface Props {
  height?: number;
  drawLine?: boolean;
  additionalLineStyle?: StyleProp<ViewStyle>;
}
const Separator = ({height = 20, drawLine, additionalLineStyle}: Props) => {
  const lineStyle = StyleSheet.create({
    line: {
      borderColor: 'black',
      margin: 10,
      borderTopWidth: 0.5,
    },
  });
  return (
    <View
      style={[
        {marginTop: height},
        drawLine ? lineStyle.line : null,
        additionalLineStyle,
      ]}
    />
  );
};

export default Separator;
