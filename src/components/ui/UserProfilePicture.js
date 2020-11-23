import React from 'react';
import Image from 'react-native-fast-image';

export default ({username, style}) => (
  <Image
    style={style}
    source={{uri: `https://images.hive.blog/u/${username}/avatar`}}
  />
);
