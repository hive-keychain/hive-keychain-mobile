import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';

interface Props {
  source: string;
  size?: number;
}

const FastImageComponent = ({
  source,
  size,
  ...props
}: Props & FastImageProps) => {
  const style = StyleSheet.flatten(props.style);

  return (
    <FastImage
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
