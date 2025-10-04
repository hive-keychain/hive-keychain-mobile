import {ExtendedAccount} from '@hiveio/dhive';
import {setAccountValueDisplay} from 'actions/index';
import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  getFontSizeSmallDevices,
  headerH2Primary,
} from 'src/styles/typography';
import {RootState} from 'store';
import {withCommas} from 'utils/format.utils';
import {getAccountValue} from 'utils/price.utils';

type Props = {
  prices: CurrencyPrices;
  account: ExtendedAccount;
  title: string;
  properties: GlobalProperties;
  theme: Theme;
} & PropsFromRedux;
const AccountValue = ({
  prices,
  account,
  properties,
  theme,
  title,
  accountValueDisplay,
  setAccountValueDisplay,
  userTokens,
  tokensMarket,
}: Props) => {
  const [accountValue, setAccountValue] = useState([]);

  useEffect(() => {
    init();
  }, [prices, properties, account, userTokens]);

  const init = async () => {
    if (prices.bitcoin && account && properties.globals) {
      const accVal =
        (await getAccountValue(
          account,
          prices,
          properties.globals,
          userTokens,
          tokensMarket,
        )) + '';
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
  };
  const styles = getStyles(theme, useWindowDimensions());
  const regexp = new RegExp(/\d/, 'ig');

  return (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={() => {
        let index = accountValueDisplay + 1;
        if (index === 3) index = 0;
        setAccountValueDisplay(index);
      }}>
      <Text style={[styles.title, styles.textBase, styles.textCentered]}>
        {title}
      </Text>
      <Text style={[styles.accountValue, styles.textBase]}>
        {accountValue[accountValueDisplay]}
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

const connector = connect(
  (state: RootState) => ({
    accountValueDisplay: state.accountValueDisplay,
    userTokens: state.userTokens.list,
    tokensMarket: state.tokensMarket,
  }),
  {
    setAccountValueDisplay,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AccountValue);
