import {ExtendedAccount} from '@hiveio/dhive';
import Savings from 'assets/wallet/icon_savings.svg';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Width} from 'utils/common.types';
import {formatBalance} from 'utils/format';
import {translate} from 'utils/localize';

type Props = {
  currency: string;
  account: ExtendedAccount;
  setMax: (value: string) => void;
};

const SavingsBalance = ({currency, account, setMax}: Props) => {
  let value: number = null;
  if (currency === 'HIVE') {
    value = parseFloat(account.savings_balance + '');
  } else value = parseFloat(account.savings_hbd_balance + '');
  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
  });
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setMax(value.toFixed(3) + '');
      }}>
      <View style={styles.main}>
        <View style={styles.left}>
          <View style={styles.logo}>
            <Savings />
          </View>
          <Text style={styles.name}>{translate('common.balance')}</Text>
        </View>
        <Text style={styles.amount}>
          {formatBalance(value)}
          <Text style={styles.currency}>{` ${currency}`}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width}: Width) =>
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
    currency: {color: '#7E8C9A'},
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export default SavingsBalance;
