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
import {toHP, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';

type Props = {
  currency: string;
  account?: ExtendedAccount;
  pd?: boolean;
  globalProperties?: DynamicGlobalProperties;
  isHiveEngine?: boolean;
  tokenBalance?: string;
  tokenLogo?: JSX.Element;
  setAvailableBalance?: (value: string) => void;
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
  theme,
  setAvailableBalance,
}: Props) => {
  const getParsedValue = (
    currency: string,
    account: ExtendedAccount,
    isHiveEngine?: boolean,
  ) => {
    let tempBalance;
    switch (true) {
      case isHiveEngine:
        tempBalance = +tokenBalance!;
        break;
      case currency === getCurrency('HIVE'):
        tempBalance = parseFloat((account.balance as string).split(' ')[0]);
        break;
      case currency === getCurrency('HBD'):
        tempBalance = parseFloat((account.hbd_balance as string).split(' ')[0]);
        break;
      case currency === getCurrency('HP'):
        let hpBalance = toHP(
          (account.vesting_balance as string).split(' ')[0],
          globalProperties,
        );
        if (pd) {
          hpBalance =
            hpBalance -
            parseFloat(
              (account.delegated_vesting_shares as string).split(' ')[0],
            );
        }
        tempBalance = hpBalance;
        break;
    }
    return tempBalance;
  };

  // Calculate parsedValue for display
  let parsedValue = getParsedValue(currency, account, isHiveEngine);

  // useEffect to update available balance
  React.useEffect(() => {
    if (setAvailableBalance) {
      setAvailableBalance(
        withCommas(getParsedValue(currency, account, isHiveEngine).toString()),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, account, isHiveEngine, tokenBalance, globalProperties, pd]);

  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({
    width,
    height,
    theme,
  });
  return (
    <TouchableOpacity activeOpacity={1}>
      <View>
        <Text style={[styles.textBalance, styles.centeredText]}>
          {withCommas(parsedValue.toString())} {` ${currency}`}
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
  theme,
}: {
  width: number;
  height: number;
  theme: Theme;
}) =>
  StyleSheet.create({
    logo: {justifyContent: 'center', alignItems: 'center'},
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
      fontSize: getFontSizeSmallDevices(width, headerH2Primary.fontSize),
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
