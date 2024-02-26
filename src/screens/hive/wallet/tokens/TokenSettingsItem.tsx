import HiveEngine from 'assets/wallet/hive_engine.png';
import React, {useState} from 'react';
import {Image as Img, StyleSheet, Text, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Image from 'react-native-fast-image';
import {Theme} from 'src/context/theme.context';
import {Token} from 'src/interfaces/tokens.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  fields_primary_text_1,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {getBackgroundColorFromBackend} from 'utils/colors';
import {nFormatter} from 'utils/format';
import {translate} from 'utils/localize';

interface TokenSettingsItemProps {
  token: Token;
  theme: Theme;
  heightDevice: number;
  widthDevice: number;
  checkedValue: boolean;
  setChecked: () => void;
  addBackground?: boolean;
}

const TokenSettingsItem = ({
  token,
  theme,
  heightDevice,
  widthDevice,
  addBackground,
  checkedValue,
  setChecked,
}: TokenSettingsItemProps) => {
  const [hasError, setHasError] = useState(false);

  const styles = getStyles(
    theme,
    widthDevice,
    heightDevice,
    token.symbol,
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
        console.log('default');
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
    <View
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      key={token.symbol}>
      <View style={[styles.item]}>
        <Text style={[styles.textBase, styles.title]}>{token.name}</Text>
      </View>
      <>
        <View style={styles.row}>
          <View
            style={[
              styles.iconContainerBase,
              !hasError ? styles.iconContainerBaseWithBg : undefined,
            ]}>
            {logo}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              checked={checkedValue}
              onPress={setChecked}
              containerStyle={[styles.checkbox]}
              checkedColor={PRIMARY_RED_COLOR}
              size={22}
            />
            <View>
              <Text>
                <Text style={styles.textBase}>{token.symbol} </Text>
                <Text style={styles.textBase}>
                  {translate('wallet.operations.token_settings.issued_by')}
                </Text>
              </Text>
              <Text style={styles.textBase}>
                {' @'}
                {token.issuer}
              </Text>
              <Text style={styles.textBase}>
                {nFormatter(parseFloat(token.circulatingSupply), 3)}
                {'/'}
                {nFormatter(parseFloat(token.maxSupply), 3)}
              </Text>
            </View>
          </View>
        </View>
      </>
    </View>
  );
};

const getStyles = (
  theme: Theme,
  width: number,
  height: number,
  symbol: string,
  addBackground?: boolean,
) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    title: {
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(height, 16),
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
      width: 40,
      height: 40,
    },
    iconContainerBase: {
      borderRadius: 50,
      width: 40,
      height: 40,
    },
    iconContainerBaseWithBg: {
      backgroundColor: addBackground
        ? getBackgroundColorFromBackend(symbol, theme)
        : undefined,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export default TokenSettingsItem;
