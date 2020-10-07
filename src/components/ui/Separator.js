import React from 'react';
import {View} from 'react-native';

const Separator = ({height}) => {
  return <View style={{marginTop: height || 20}} />;
};

export default Separator;
