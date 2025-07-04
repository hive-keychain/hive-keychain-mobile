import {clearWalletFilters} from 'actions/walletFilters';
import {VscHistoryComponentProps} from 'components/history/vsc/VscHistoryComponent';
import Separator from 'components/ui/Separator';
import {VscUtils} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getHBDButtonList} from 'src/reference-data/hbdOperationButtonList';
import {getHiveButtonList} from 'src/reference-data/hiveOperationButtonList';
import {getHPButtonList} from 'src/reference-data/hpOperationButtonList';
import {getVscHbdOperationButtonList} from 'src/reference-data/vscHbdOperationButtonList';
import {getVscHiveButtonList} from 'src/reference-data/vscHiveOperationButtonList';
import {getCardStyle} from 'src/styles/card';
import {
  GREEN_SUCCESS,
  HBDICONBGCOLOR,
  HIVEICONBGCOLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_medium,
  fields_primary_text_2,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {formatBalance, toHP} from 'utils/format';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {WalletHistoryComponentProps} from '../history/WalletHistoryComponent';
import Icon from './Icon';
import IconHP from './IconHP';
import IconVscHbd from './IconVscHbd';
import IconVscHive from './IconVscHive';

interface Props {
  theme: Theme;
  currencyName: string;
  itemIndex: number;
  onPress: () => void;
}

const CurrencyToken = ({
  theme,
  currencyName,
  user,
  properties,
  price,
  onPress,
}: Props & PropsFromRedux) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [subValue, setSubValue] = useState<string | undefined>(undefined);
  const [preFixSubValue, setPreFixSubValue] = useState<string | undefined>(
    undefined,
  );
  const [subValueShortDescription, setSubValueShortDescription] = useState<
    string | undefined
  >(undefined);

  const getButtons = (currency: string) => {
    switch (currency) {
      case 'HIVE':
        return getHiveButtonList(user, theme);
      case 'HBD':
        return getHBDButtonList(user, theme);
      case 'HP':
        return getHPButtonList(theme, user.name!);
      case 'VSCHIVE':
        return getVscHiveButtonList(user, theme);
      case 'VSCHBD':
        return getVscHbdOperationButtonList(user, theme);
    }
  };
  const [buttons, setButtons] = useState<JSX.Element[]>(
    getButtons(currencyName),
  );

  const styles = getStyles(theme, useWindowDimensions());

  const getPlusPrefix = (value: string | number) => {
    if (typeof value === 'string') {
      return parseFloat(value) > 0 ? '+' : undefined;
    } else if (typeof value === 'number') {
      return value > 0 ? '+' : undefined;
    }
  };

  useEffect(() => {
    getBalance();
  }, [user]);

  const getBalance = async () => {
    if (user && user.name && Object.keys(user.account).length > 0) {
      if (currencyName === 'HIVE') {
        setBalance(parseFloat(user.account.balance as string));
        setSubValue(
          parseFloat(user.account.savings_balance as string) > 0
            ? (user.account.savings_balance as string).split(' ')[0]
            : undefined,
        );
        setPreFixSubValue(
          getPlusPrefix(user.account.savings_balance as string),
        );
      } else if (currencyName === 'HBD') {
        setBalance(parseFloat(user.account.hbd_balance as string));
        setSubValue(
          parseFloat(user.account.savings_hbd_balance as string) > 0
            ? (user.account.savings_hbd_balance as string).split(' ')[0]
            : undefined,
        );
        setPreFixSubValue(
          parseFloat(user.account.savings_hbd_balance as string) > 0
            ? '+'
            : undefined,
        );
      } else if (currencyName === 'HP') {
        setBalance(
          toHP(user.account.vesting_shares as string, properties.globals),
        );
        const delegatedVestingShares = parseFloat(
          user.account.delegated_vesting_shares
            .toString()
            .replace(' VESTS', ''),
        );
        const receivedVestingShares = parseFloat(
          user.account.received_vesting_shares.toString().replace(' VESTS', ''),
        );
        const delegationVestingShares = (
          receivedVestingShares - delegatedVestingShares
        ).toFixed(3);

        const delegation = toHP(delegationVestingShares, properties.globals);
        setSubValue(delegation.toFixed(3));
        setPreFixSubValue(getPlusPrefix(delegation));
        setSubValueShortDescription(translate('common.deleg'));
      } else if (currencyName === 'VSCHIVE') {
        try {
          const vscBalance = await VscUtils.getAccountBalance(user.name!);
          setBalance(vscBalance.hive / 1000);
        } catch (error) {
          console.error('Error getting VSC HIVE balance:', error);
          setBalance(0);
        }
      } else if (currencyName === 'VSCHBD') {
        try {
          const vscBalance = await VscUtils.getAccountBalance(user.name!);
          const hbdBalance = vscBalance.hbd / 1000;
          const hbdSavings = vscBalance.hbd_savings / 1000;
          setBalance(hbdBalance);
          setSubValue(hbdSavings.toFixed(3));
          setPreFixSubValue(getPlusPrefix(hbdSavings));
          setSubValueShortDescription(translate('common.savings'));
        } catch (error) {
          console.error('Error getting VSC HBD balance:', error);
          setBalance(0);
          setSubValue('');
          setPreFixSubValue(undefined);
          setSubValueShortDescription(translate('common.savings'));
        }
      }
    }
  };

  const onHandleGoToWalletHistory = () => {
    clearWalletFilters();
    if (currencyName === 'VSCHIVE' || currencyName === 'VSCHBD') {
      navigate('VscHistoryScreen', {
        currency: currencyName.toLowerCase(),
      } as VscHistoryComponentProps);
    } else {
      navigate('WalletHistoryScreen', {
        currency: currencyName.toLowerCase(),
      } as WalletHistoryComponentProps);
    }
  };

  const getCurrencyLogo = () => {
    switch (currencyName) {
      case 'HIVE':
        return (
          <Icon
            theme={theme}
            name={Icons.HIVE_CURRENCY_LOGO}
            additionalContainerStyle={styles.hiveIconContainer}
            {...styles.icon}
          />
        );
      case 'HBD':
        return (
          <Icon
            theme={theme}
            name={Icons.HBD_CURRENCY_LOGO}
            additionalContainerStyle={[
              styles.hiveIconContainer,
              styles.hbdIconBgColor,
            ]}
            {...styles.icon}
          />
        );
      case 'HP':
        return (
          <IconHP theme={theme} additionalContainerStyle={{marginTop: 8}} />
        );
      case 'VSCHIVE':
        return <IconVscHive theme={theme} />;
      case 'VSCHBD':
        return <IconVscHbd theme={theme} />;
    }
  };

  const getTokenPrice = () => {
    let variation, coinPrice, isPositive;
    if (currencyName === 'HIVE' || currencyName === 'VSCHIVE') {
      coinPrice = price.hive.usd;
      variation = price.hive.usd_24h_change;
      isPositive = price.hive.usd_24h_change >= 0;
    } else if (currencyName === 'HBD' || currencyName === 'VSCHBD') {
      coinPrice = price.hive_dollar.usd;
      variation = price.hive_dollar.usd_24h_change;
      isPositive = price.hive_dollar.usd_24h_change >= 0;
    } else return null;
    if (!coinPrice) return null;
    return (
      <>
        <Separator />
        <View style={styles.tokenInformationRow}>
          <Text style={[styles.priceText]}>Price</Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.priceText,
                {marginRight: 10},
              ]}>{`$ ${coinPrice.toFixed(2)}`}</Text>
            <Text
              style={[
                styles.priceText,
                {
                  color: isPositive ? GREEN_SUCCESS : PRIMARY_RED_COLOR,
                },
              ]}>
              {`${Math.abs(variation).toFixed(2)}%`}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                paddingBottom: -1,
                transform: !isPositive ? [{rotate: '180deg'}] : undefined,
              }}>
              <Icon
                name={Icons.CARRET_UP}
                color={isPositive ? GREEN_SUCCESS : PRIMARY_RED_COLOR}
                height={10}
              />
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={getCardStyle(theme).wrapperCardItem}>
      <View style={styles.container} key={`currency-token-${currencyName}`}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            onPress();
            setIsExpanded(!isExpanded);
          }}
          style={styles.rowContainer}>
          <View style={styles.leftContainer}>
            {getCurrencyLogo()}
            <Text style={[styles.textSymbol, styles.marginLeft]}>
              {currencyName === 'VSCHIVE'
                ? 'HIVE'
                : currencyName === 'VSCHBD'
                ? 'HBD'
                : currencyName}
            </Text>
          </View>
          <View style={isExpanded ? styles.rowContainer : undefined}>
            <View>
              <Text style={[styles.textAmount, styles.alignedRight]}>
                {balance ? formatBalance(balance) : 0}
              </Text>
              {subValue && (
                <Text
                  style={[
                    styles.textAmount,
                    styles.opaque,
                    styles.alignedRight,
                  ]}>
                  {preFixSubValue ? preFixSubValue : ''}{' '}
                  {formatBalance(parseFloat(subValue))} (
                  {subValueShortDescription ?? translate('common.savings')})
                </Text>
              )}
            </View>
            {isExpanded && (
              <Icon
                key={`show-token-history-${currencyName}`}
                name={Icons.BACK_TIME}
                onPress={onHandleGoToWalletHistory}
                additionalContainerStyle={styles.squareButton}
                theme={theme}
                color={PRIMARY_RED_COLOR}
              />
            )}
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View>
            {getTokenPrice()}
            <Separator drawLine additionalLineStyle={styles.line} />
            <View style={styles.rowWrappedContainer}>{buttons}</View>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      borderRadius: 20,
      width: '100%',
      backgroundColor: getColors(theme).secondaryCardBgColor,
      paddingHorizontal: width * 0.05,
      paddingVertical: width * 0.03,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textAmount: {
      color: getColors(theme).totalDisplayTextAmount,
      lineHeight: 17,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, body_primary_body_2.fontSize),
    },
    textSymbol: {
      ...button_link_primary_medium,
      lineHeight: 22,
      color: getColors(theme).symbolText,
      fontSize: getFontSizeSmallDevices(
        width,
        button_link_primary_medium.fontSize,
      ),
    },
    marginLeft: {
      marginLeft: 6,
    },
    opaque: {
      opacity: 0.5,
    },
    alignedRight: {
      textAlign: 'right',
    },
    line: {
      height: 1,
      borderColor: getColors(theme).cardBorderColorContrast,
      marginTop: 10,
    },
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      marginLeft: 7,
      padding: 8,
    },
    rowWrappedContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    icon: {
      width: 20,
      height: 20,
    },
    hiveIconContainer: {
      borderRadius: 50,
      padding: 5,
      backgroundColor: HIVEICONBGCOLOR,
    },
    hbdIconBgColor: {
      backgroundColor: HBDICONBGCOLOR,
    },
    priceText: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
      fontSize: 12,
      fontWeight: '400',
      opacity: 0.7,
    },
    tokenInformationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginVertical: 4,
    },
    iconBase: {
      width: 24,
      height: 24,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    properties: state.properties,
    price: state.currencyPrices,
  };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CurrencyToken);
