import {DynamicGlobalProperties, ExtendedAccount} from '@hiveio/dhive';
import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {FontPoppinsName, headerH2Primary} from 'src/styles/typography';
import {Width} from 'utils/common.types';
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
  //TODO make fix after refactoring.
  using_new_ui?: boolean;
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
  using_new_ui,
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
  const styles = getDimensionedStyles({
    color,
    theme,
    ...useWindowDimensions(),
  });
  return using_new_ui ? (
    <TouchableOpacity
      style={styles.clickeableContainer}
      onPress={() => {
        if (setMax) {
          setMax(parsedValue.toFixed(3) + '');
        }
      }}>
      <View style={styles.balanceContainer}>
        <Text style={[styles.textBalance, styles.centeredText]}>
          {formatBalance(parsedValue)} {` ${currency}`}
        </Text>
        <Text style={[styles.balanceText, styles.centeredText]}>
          {translate('common.balance')}
        </Text>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (setMax) {
          setMax(parsedValue.toFixed(3) + '');
        }
      }}>
      <View style={styles.main}>
        <View style={styles.left}>
          <View style={styles.logo}>{logo}</View>
          <Text style={styles.name}>
            {(pd
              ? translate('common.available')
              : translate('common.balance')
            ).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.amount}>
          {formatBalance(parsedValue)}
          <Text style={styles.currency}>{` ${currency}`}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({
  width,
  color,
  theme,
}: Width & {color?: string; theme: Theme}) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 10,
      width: '100%',
      backgroundColor: '#DCE4EA',
      paddingHorizontal: width * 0.05,
      paddingVertical: width * 0.03,
    },
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {display: 'flex', flexDirection: 'row', alignItems: 'center'},
    logo: {justifyContent: 'center', alignItems: 'center'},
    name: {
      marginLeft: width * 0.03,
      fontSize: 15,
      color: '#404950',
    },
    amount: {fontSize: 17},
    currency: {color},
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    //TODO cleanup styles, delete unused
    clickeableContainer: {},
    balanceContainer: {},
    textBalance: {
      ...headerH2Primary,
      color: getColors(theme).primaryText,
      height: headerH2Primary.fontSize,
      lineHeight: headerH2Primary.fontSize + 5,
      textAlignVertical: 'auto',
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
