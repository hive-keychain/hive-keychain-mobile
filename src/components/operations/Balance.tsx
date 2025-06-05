import {DynamicGlobalProperties, ExtendedAccount} from '@hiveio/dhive';
import Loader from 'components/ui/Loader';
import {VscUtils} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
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
  const [parsedValue, setParsedValue] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const getParsedValue = async (
    currency: string,
    account: ExtendedAccount,
    isHiveEngine?: boolean,
  ) => {
    let tempBalance;
    setLoadingBalance(true);
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
      case currency === getCurrency('VSCHIVE'):
        const vscBalance = await VscUtils.getAccountBalance(account.name);
        tempBalance = vscBalance.hive / 1000;
        break;
      case currency === getCurrency('VSCHBD'):
        const vscHbdBalance = await VscUtils.getAccountBalance(account.name);
        tempBalance = vscHbdBalance.hbd / 1000;
        break;
    }
    if (setAvailableBalance)
      setAvailableBalance(withCommas(tempBalance.toString()));
    setLoadingBalance(false);
    return tempBalance;
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const value = await getParsedValue(currency, account, isHiveEngine);
        setParsedValue(value);
      }
    };
    fetchBalance();
  }, [currency, account, isHiveEngine, tokenBalance, pd, globalProperties]);

  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({
    width,
    height,
    theme,
  });
  return (
    <TouchableOpacity activeOpacity={1}>
      <View>
        {loadingBalance ? (
          <Loader animating size={'small'} />
        ) : (
          <Text style={[styles.textBalance, styles.centeredText]}>
            {withCommas(parsedValue.toString())} {` ${currency.replace('VSC', '')}`}
          </Text>
        )}
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
