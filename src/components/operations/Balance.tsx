import {DynamicGlobalProperties, ExtendedAccount} from '@hiveio/dhive';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Width} from 'utils/common.types';
import {formatBalance, toHP} from 'utils/format';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';

type Props = {
  currency: string;
  account?: ExtendedAccount;
  pd?: boolean;
  globalProperties?: DynamicGlobalProperties;
  engine?: boolean;
  tokenBalance?: string;
  tokenLogo?: JSX.Element;
  setMax: (value: string) => void;
};

const Balance = ({
  currency,
  account,
  pd,
  globalProperties,
  engine,
  tokenBalance,
  tokenLogo,
  setMax,
}: Props) => {
  let {color, value, logo} = getCurrencyProperties(currency, account);
  let parsedValue = parseFloat(value as string);

  if (pd && value) {
    parsedValue =
      parseFloat(value as string) -
      parseFloat(account.delegated_vesting_shares as string);
    parsedValue = toHP(value as string, globalProperties);
  }
  if (engine) {
    parsedValue = +tokenBalance!;
    logo = tokenLogo!;
  }
  const styles = getDimensionedStyles({
    color,
    ...useWindowDimensions(),
  });
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setMax(parsedValue.toFixed(3) + '');
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

const getDimensionedStyles = ({width, color}: Width & {color?: string}) =>
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
  });

export default Balance;
