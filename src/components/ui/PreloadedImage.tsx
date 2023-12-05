import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import FallBackHBD from 'src/assets/new_UI/hbd-currency-logo.svg';
import FallBackHIVE from 'src/assets/new_UI/hive-currency-logo.svg';
import FallBackHE from 'src/assets/new_UI/hive-engine.svg';
import {getCurrency} from 'utils/hive';

interface Props {
  uri: string;
  symbol: string;
}

const PreloadedImage = ({uri, symbol}: Props) => {
  const [errorOnLoad, setErrorOnLoad] = useState(false);

  const renderFallback = () => {
    switch (symbol) {
      case getCurrency('HBD'):
        return <FallBackHBD {...styles.img} />;
      case getCurrency('HIVE'):
        return <FallBackHIVE {...styles.img} />;
      default:
        return <FallBackHE {...styles.img} />;
    }
  };

  return !errorOnLoad ? (
    <FastImage
      source={{uri}}
      onError={() => setErrorOnLoad(true)}
      style={styles.img}
    />
  ) : (
    <View style={styles.imgContainer}>{renderFallback()}</View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 25,
    height: 25,
  },
  imgContainer: {
    backgroundColor: '#FFF',
    borderRadius: 50,
  },
});

export default PreloadedImage;
