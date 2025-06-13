import {ExtendedAccount} from '@hiveio/dhive';
import {setAccountValueDisplay} from 'actions/index';
import {CurrencyPrices, GlobalProperties} from 'actions/interfaces';
import {VscAccountBalance, VscUtils} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  getFontSizeSmallDevices,
  headerH2Primary,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {getAccountValue} from 'utils/price';

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
      let vscBalance: VscAccountBalance;
      try {
        vscBalance = await VscUtils.getAccountBalance(account.name);
      } catch (error) {
        console.error('Error getting VSC balance:', error);
        vscBalance = {
          account: account.name,
          block_height: 0,
          hbd_avg: 0,
          hbd_claim: 0,
          hbd_savings: 0,
          hive: 0,
          hive_consensus: 0,
          hbd: 0,
          hbd_modify: 0,
          pending_hbd_unstaking: 0,
        };
      }
      const accVal =
        (await getAccountValue(
          account,
          vscBalance,
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
