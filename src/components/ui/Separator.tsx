import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

interface Props {
  height?: number;
  drawLine?: boolean;
  additionalLineStyle?: StyleProp<ViewStyle>;
}
const Separator = ({height = 20, drawLine, additionalLineStyle}: Props) => {
  const lineStyle = {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  };
  return (
    <View
      style={[
        {marginTop: height},
        drawLine ? lineStyle : null,
        additionalLineStyle,
      ]}
    />
  );
};

export default Separator;
