import {DynamicGlobalProperties, ExtendedAccount} from '@hiveio/dhive';
import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  getFontSizeSmallDevices,
  headerH2Primary,
} from 'src/styles/typography';
import {formatBalance, toHP} from 'utils/format';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';

type Props = {
  currency: string;
  account?: ExtendedAccount;
  pd?: boolean;
  globalProperties?: DynamicGlobalProperties;
  isHiveEngine?: boolean;
  tokenBalance?: string;
  tokenLogo?: JSX.Element;
  setMax?: (value: string) => void;
  theme?: Theme;
};

const Balance = ({
  currency,
  account,
  pd,
  globalProperties,
  isHiveEngine,
  tokenBalance,
  tokenLogo,
  setMax,
  theme,
}: Props) => {
  let {color, value, logo} = getCurrencyProperties(currency, account);
  let parsedValue = parseFloat(value as string);

  if (pd && value) {
    parsedValue =
      parseFloat(value as string) -
      parseFloat(account.delegated_vesting_shares as string);
    parsedValue = toHP(value as string, globalProperties);
  }
  if (isHiveEngine) {
    parsedValue = +tokenBalance!;
    logo = tokenLogo!;
  }
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({
    width,
    height,
    color,
    theme,
  });
  return (
    <TouchableOpacity
      onPress={() => {
        if (setMax) {
          setMax(parsedValue.toFixed(3) + '');
        }
      }}>
      <View>
        <Text style={[styles.textBalance, styles.centeredText]}>
          {formatBalance(parsedValue)} {` ${currency}`}
        </Text>
        <Text style={[styles.balanceText, styles.centeredText]}>
          {translate('common.balance')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({
  width,
  height,
  color,
  theme,
}: {
  width: number;
  height: number;
  color?: string;
  theme: Theme;
}) =>
  StyleSheet.create({
    logo: {justifyContent: 'center', alignItems: 'center'},
    currency: {color},
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textBalance: {
      ...headerH2Primary,
      color: getColors(theme).primaryText,
      height: headerH2Primary.fontSize,
      lineHeight: headerH2Primary.fontSize + 5,
      textAlignVertical: 'auto',
      fontSize: getFontSizeSmallDevices(height, headerH2Primary.fontSize),
    },
    centeredText: {
      textAlign: 'center',
    },
    balanceText: {
      color: getColors(theme).quinaryText,
      fontFamily: FontPoppinsName.REGULAR,
      fontSize: 20,
    },
  });

export default Balance;
