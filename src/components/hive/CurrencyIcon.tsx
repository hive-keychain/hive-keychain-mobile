import HiveEngine from 'assets/wallet/hive_engine.png';
import FastImageComponent from 'components/ui/FastImage';
import React, {useState} from 'react';
import {Image as Img, StyleSheet, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {Token} from 'src/interfaces/tokens.interface';
import {HBDICONBGCOLOR, HIVEICONBGCOLOR} from 'src/styles/colors';
import {Colors, getTokenBackgroundColor} from 'utils/colors';
import Icon from './Icon';
import IconHP from './IconHP';

interface PropsHive {
  currencyName: 'HIVE' | 'HBD' | 'HP' | 'TESTS' | 'TBD' | 'TP';
  tokenInfo?: never;
  addBackground?: never;
  colors?: never;
  symbol?: never;
}
interface PropsHiveEngine {
  currencyName: string;
  tokenInfo: Token;
  addBackground?: boolean;
  colors: Colors;
  symbol: string;
}

type Props = PropsHive | PropsHiveEngine;
const CurrencyIcon = ({
  currencyName,
  tokenInfo,
  addBackground,
  colors,
  symbol,
}: Props) => {
  const {theme} = useThemeContext();
  const [hasError, setHasError] = useState(0);
  const styles = getStyles(addBackground, colors, symbol, theme);
  const getLogo = () => {
    switch (hasError) {
      case 0:
        if (!tokenInfo.metadata.icon) setHasError(2);
        return (
          <FastImageComponent
            style={styles.iconBase}
            source={tokenInfo.metadata.icon}
            onError={() => {
              setHasError(1);
            }}
          />
        );
      case 1:
        return (
          <FastImageComponent
            style={styles.iconBase}
            source={`https://images.hive.blog/0x0/${tokenInfo.metadata.icon}`}
            onError={() => {
              setHasError(2);
            }}
          />
        );
      case 2:
        return (
          <Image
            style={styles.iconBase}
            source={{
              uri: Img.resolveAssetSource(HiveEngine).uri,
            }}
            onError={() => {}}
          />
        );
      default:
        return null;
    }
  };

  switch (currencyName) {
    case 'HIVE':
    case 'TESTS':
      return (
        <Icon
          theme={theme}
          name={Icons.HIVE_CURRENCY_LOGO}
          additionalContainerStyle={styles.hiveIconContainer}
          {...styles.icon}
        />
      );
    case 'HBD':
    case 'TBD':
      return (
        <Icon
          theme={theme}
          name={Icons.HBD_CURRENCY_LOGO}
          additionalContainerStyle={[
            styles.hiveIconContainer,
            styles.hbdIconBgColor,
          ]}
          {...styles.icon}
        />
      );
    case 'HP':
    case 'TP':
      return <IconHP theme={theme} additionalContainerStyle={{}} />;
    default:
      return (
        <View
          style={[
            styles.iconContainerBase,
            !hasError ? styles.iconContainerBaseWithBg : undefined,
          ]}>
          {getLogo()}
        </View>
      );
  }
};

const getStyles = (
  addBackground: boolean,
  colors: Colors,
  symbol: string,
  theme: Theme,
) =>
  StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
    },
    hiveIconContainer: {
      borderRadius: 50,
      width: 32,
      height: 32,
      padding: 5,
      backgroundColor: HIVEICONBGCOLOR,
    },
    hbdIconBgColor: {
      backgroundColor: HBDICONBGCOLOR,
    },
    iconBase: {
      width: 24,
      height: 24,
    },
    iconContainerBase: {
      width: 32,
      height: 32,
      padding: 5,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainerBaseWithBg: {
      backgroundColor: addBackground
        ? getTokenBackgroundColor(colors, symbol, theme)
        : undefined,
    },
  });

export default CurrencyIcon;
