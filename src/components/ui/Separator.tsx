import React from 'react';
import {View} from 'react-native';

interface Props {
  height?: number;
  drawLine?: boolean;
}
const Separator = ({height = 20, drawLine}: Props) => {
  const lineStyle = {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  };
  return <View style={[{marginTop: height}, drawLine ? lineStyle : null]} />;
};

export default Separator;
