import HiveEngine from 'assets/images/hive/hive_engine.png';
import FastImageComponent from 'components/ui/FastImage';
import {Image} from 'expo-image';
import ImageUtils from 'hive-keychain-commons/lib/utils/images.utils';
import React, {useState} from 'react';
import {
  Image as Img,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {Token} from 'src/interfaces/tokens.interface';
import {HBDICONBGCOLOR, HIVEICONBGCOLOR} from 'src/styles/colors';
import {Colors, getTokenBackgroundColor} from 'utils/colors.utils';
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

type Props = (PropsHive | PropsHiveEngine) & {
  containerStyle?: StyleProp<ViewStyle>;
};
const CurrencyIcon = ({
  currencyName,
  tokenInfo,
  addBackground,
  colors,
  symbol,
  containerStyle,
}: Props) => {
  const {theme} = useThemeContext();
  const [hasError, setHasError] = useState(0);
  const styles = getStyles(addBackground, colors, symbol, theme);
  const getLogo = () => {
    switch (hasError) {
      case 0:
        if (!tokenInfo.metadata.icon) setHasError(1);
        return (
          <FastImageComponent
            style={styles.iconBase}
            source={ImageUtils.getImmutableImage(tokenInfo.metadata.icon)}
            onError={() => {
              setHasError(1);
            }}
          />
        );
      case 1:
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
          name={Icons.HIVE}
          additionalContainerStyle={styles.hiveIconContainer}
          {...styles.icon}
        />
      );
    case 'HBD':
    case 'TBD':
      return (
        <Icon
          theme={theme}
          name={Icons.HBD}
          additionalContainerStyle={[
            styles.hiveIconContainer,
            styles.hbdIconBgColor,
          ]}
          {...styles.icon}
        />
      );
    case 'HP':
    case 'TP':
    case 'VESTS':
    case 'GRC':
      return <IconHP theme={theme} additionalContainerStyle={{}} />;
    default:
      return (
        <View
          style={[
            styles.iconContainerBase,
            containerStyle,
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
