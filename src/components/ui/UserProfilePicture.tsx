import React from 'react';
import {StyleProp} from 'react-native';
import Image, {ImageStyle} from 'react-native-fast-image';

type Props = {
  username: string;
  style: StyleProp<ImageStyle>;
};

export default ({username, style}: Props) => (
  <Image
    style={style}
    source={{uri: `https://images.hive.blog/u/${username}/avatar`}}
    resizeMode={Image.resizeMode.contain}
    fallback
  />
);
