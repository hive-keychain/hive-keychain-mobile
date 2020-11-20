import React from 'react';
import {Image} from 'react-native';

export default ({username, style}) => (
  <Image
    style={style}
    source={{uri: `https://images.hive.blog/u/${username}/avatar`}}
  />
);
