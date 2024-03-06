import {ExtendedAccount} from '@hiveio/dhive';
import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  getFontSizeSmallDevices,
  headerH2Primary,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {getAccountValue} from 'utils/price';

type Props = {
  prices: CurrencyPrices;
  account: ExtendedAccount;
  title: string;
  properties: GlobalProperties;
  theme: Theme;
};
const AccountValue = ({prices, account, properties, theme, title}: Props) => {
  const [hideValue, setHideValue] = useState(false);
  const [accountValue, setAccountValue] = useState([]);
  const [accountValueIndex, setAccountValueIndex] = useState(0);
  useEffect(() => {
    if (prices.bitcoin && account && properties.globals) {
      const accVal = getAccountValue(account, prices, properties.globals) + '';
      if (isNaN(+accVal)) {
        setAccountValue(['...']);
        return;
      } else {
        setAccountValue([
          `$ ${withCommas(accVal, 0)}`,
          `${withCommas(parseFloat(accVal) / prices.hive.usd + '', 0)} HIVE`,
          `* * *`,
        ]);
      }
    }
  }, [prices, properties, account]);

  const styles = getStyles(theme, useWindowDimensions());
  const regexp = new RegExp(/\d/, 'ig');

  return (
    <TouchableOpacity
      onLongPress={() => {
        let index = accountValueIndex + 1;
        if (index === 3) index = 0;
        setAccountValueIndex(index);
      }}>
      <Text style={[styles.title, styles.textBase, styles.textCentered]}>
        {title}
      </Text>
      <Text style={[styles.accountValue, styles.textBase]}>
        {accountValue[accountValueIndex]}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    accountValue: {
      ...headerH2Primary,
      fontSize: getFontSizeSmallDevices(width, 40),
      textAlign: 'center',
    },
    title: {
      ...body_primary_body_1,
      opacity: 0.6,
      fontSize: getFontSizeSmallDevices(width, body_primary_body_1.fontSize),
    },
    textBase: {
      color: getColors(theme).secondaryText,
    },
    textCentered: {
      textAlign: 'center',
    },
  });

export default AccountValue;
