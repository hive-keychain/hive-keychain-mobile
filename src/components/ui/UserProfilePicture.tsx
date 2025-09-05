import {Image, ImageStyle} from 'expo-image';
import React from 'react';
import {StyleProp} from 'react-native';

type Props = {
  username: string;
  style: StyleProp<ImageStyle>;
};

export default ({username, style}: Props) => (
  <Image
    style={style}
    source={{uri: `https://images.hive.blog/u/${username}/avatar`}}
    contentFit="contain"
  />
);
