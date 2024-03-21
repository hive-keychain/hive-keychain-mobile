import React, {useState} from 'react';
import {ImageStyle, StyleProp, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import FallBackHBD from 'src/assets/new_UI/hbd-currency-logo.svg';
import FallBackHIVE from 'src/assets/new_UI/hive-currency-logo.svg';
import FallBackHE from 'src/assets/new_UI/hive-engine.svg';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getBackgroundColorFromBackend} from 'utils/colors';
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
  const {theme} = useThemeContext();
  const [errorOnLoad, setErrorOnLoad] = useState(false);
  const styles = getStyles();

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

  const getBgColor = (symbol: string, theme: Theme) => {
    switch (symbol) {
      case getCurrency('HBD'):
        return 'rgb(223, 246, 225)';
      case getCurrency('HIVE'):
        return 'rgb(253, 235, 238)';
      default:
        return getBackgroundColorFromBackend(symbol, theme);
    }
  };

  const finalStyle = additionalContainerStyle
    ? {...styles.imgContainer, ...{additionalContainerStyle}}
    : styles.imgContainer;

  const withBgStyle = {
    ...finalStyle,
    backgroundColor: getBgColor(symbol, theme),
  };

  return !errorOnLoad ? (
    <FastImage
      source={{uri}}
      onError={() => {
        setErrorOnLoad(true);
      }}
      style={withBgStyle}
    />
  ) : (
    <View style={withBgStyle}>{renderFallback(svgHeight, svgWidth)}</View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    imgContainer: {
      borderRadius: 100,
      width: 25,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default PreloadedImage;
