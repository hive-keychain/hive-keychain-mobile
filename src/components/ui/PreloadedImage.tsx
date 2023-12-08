import React, {useState} from 'react';
import {ImageStyle, StyleProp, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import FallBackHBD from 'src/assets/new_UI/hbd-currency-logo.svg';
import FallBackHIVE from 'src/assets/new_UI/hive-currency-logo.svg';
import FallBackHE from 'src/assets/new_UI/hive-engine.svg';
import {getCurrency} from 'utils/hive';

interface Props {
  uri: string;
  symbol: string;
  additionalContainerStyle?: StyleProp<ImageStyle>;
  svgWidth?: number;
  svgHeight?: number;
}

const PreloadedImage = ({
  uri,
  symbol,
  additionalContainerStyle,
  svgHeight,
  svgWidth,
}: Props) => {
  const [errorOnLoad, setErrorOnLoad] = useState(false);

  const renderFallback = (svgWidth?: number, svgHeight?: number) => {
    const svgStyles = {
      width: svgWidth ?? 25,
      height: svgHeight ?? 25,
    };
    switch (symbol) {
      case getCurrency('HBD'):
        return <FallBackHBD {...svgStyles} />;
      case getCurrency('HIVE'):
        return <FallBackHIVE {...svgStyles} />;
      default:
        return <FallBackHE {...svgStyles} />;
    }
  };

  const finalStyle = additionalContainerStyle
    ? {...styles.imgContainer, ...{additionalContainerStyle}}
    : styles.imgContainer;

  return !errorOnLoad ? (
    <FastImage
      source={{uri}}
      onError={() => setErrorOnLoad(true)}
      style={finalStyle}
    />
  ) : (
    <View style={finalStyle}>{renderFallback(svgHeight, svgWidth)}</View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    width: 25,
    height: 25,
  },
});

export default PreloadedImage;
