import HiveEngine from 'assets/images/hive/hive_engine.png';
import {Image} from 'expo-image';
import React, {memo, useState} from 'react';
import {
  Image as Img,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
// REMOVE: import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Token} from 'src/interfaces/tokens.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  fields_primary_text_1,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {Colors, getTokenBackgroundColor} from 'utils/colors.utils';
import {nFormatter} from 'utils/format.utils';
import {translate} from 'utils/localize';

interface TokenSettingsItemProps {
  token: Token;
  theme: Theme;
  heightDevice: number;
  widthDevice: number;
  checkedValue: boolean;
  setChecked: () => void;
  addBackground?: boolean;
  colors: Colors;
}

const TokenSettingsItem = ({
  token,
  theme,
  heightDevice,
  widthDevice,
  addBackground,
  checkedValue,
  setChecked,
  colors,
}: TokenSettingsItemProps) => {
  const [hasError, setHasError] = useState(false);

  const styles = getStyles(
    theme,
    widthDevice,
    heightDevice,
    token.symbol,
    colors,
    addBackground,
  );

  if (!token) {
    return null;
  }

  const logo = hasError ? (
    <Image
      style={styles.iconBase}
      source={{
        uri: Img.resolveAssetSource(HiveEngine).uri,
      }}
      onError={() => {
        console.log('default image');
      }}
    />
  ) : (
    <Image
      style={[styles.iconBase, styles.iconBase]}
      source={{
        uri: token.metadata.icon,
      }}
      onError={() => {
        setHasError(true);
      }}
    />
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={setChecked}
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      key={token.symbol}>
      <CheckBox
        checked={checkedValue}
        onPress={setChecked}
        containerStyle={[styles.checkbox]}
        checkedColor={PRIMARY_RED_COLOR}
        size={22}
      />
      <View>
        <Text style={[styles.textBase, styles.title]}>{token.name}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={[
              styles.iconContainerBase,
              !hasError ? styles.iconContainerBaseWithBg : undefined,
            ]}>
            {logo}
          </View>
          <Text style={styles.textBase}>{token.symbol} </Text>
          <Text style={styles.textBase}>
            {translate('wallet.operations.token_settings.issued_by')}
            {` @${token.issuer}`}
          </Text>
        </View>
        <Text style={[styles.textBase]}>
          {translate('wallet.operations.token_settings.supply')} :
          {nFormatter(parseFloat(token.circulatingSupply), 3)}
          {'/'}
          {nFormatter(parseFloat(token.maxSupply), 3)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: Theme,
  width: number,
  height: number,
  symbol: string,
  colors: Colors,
  addBackground?: boolean,
) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 16),
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    checkbox: {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: getColors(theme).senaryCardBorderColor,
      borderRadius: 20,
      padding: 0,
      margin: 0,
    },
    textBase: {
      ...fields_primary_text_1,
      color: getColors(theme).secondaryText,
    },
    iconBase: {
      width: 24,
      height: 24,
    },
    iconContainerBase: {
      borderRadius: 50,
      width: 24,
      height: 24,
      marginRight: 8,
    },
    iconContainerBaseWithBg: {
      backgroundColor: addBackground
        ? getTokenBackgroundColor(colors, symbol, theme)
        : undefined,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textAlignedRight: {textAlign: 'right'},
  });

export default memo(TokenSettingsItem);
