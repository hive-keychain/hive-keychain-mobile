import React from 'react';
import {View} from 'react-native';

interface Props {
  height?: number;
}
const Separator = ({height = 20}: Props) => {
  return <View style={{marginTop: height}} />;
};

export default Separator;
