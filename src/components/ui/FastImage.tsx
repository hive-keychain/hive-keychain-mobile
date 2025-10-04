import {Image, ImageProps} from 'expo-image';
import React from 'react';
import {StyleSheet} from 'react-native';

interface Props {
  source: string;
  size?: number;
}

const FastImageComponent = ({source, size, ...props}: Props & ImageProps) => {
  const style = StyleSheet.flatten(props.style);

  return (
    <Image
      source={{
        uri: source?.endsWith('.svg')
          ? `https://svg2png.deno.dev/${source}?width=${style?.width}&height=${style?.height}`
          : source,
      }}
      {...props}
    />
  );
};

export default FastImageComponent;
