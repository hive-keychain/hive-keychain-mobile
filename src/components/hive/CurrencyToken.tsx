import {clearWalletFilters} from 'actions/walletFilters';
import Separator from 'components/ui/Separator';
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
import {getCardStyle} from 'src/styles/card';
import {
  HBDICONBGCOLOR,
  HIVEICONBGCOLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_medium,
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
  itemIndex,
  onPress,
}: Props & PropsFromRedux) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState<number>(0);
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
    if (user && user.name && Object.keys(user.account).length > 0) {
      if (currencyName === 'HIVE') {
        setValue(parseFloat(user.account.balance as string));
        setSubValue(
          parseFloat(user.account.savings_balance as string) > 0
            ? (user.account.savings_balance as string).split(' ')[0]
            : undefined,
        );
        setPreFixSubValue(
          getPlusPrefix(user.account.savings_balance as string),
        );
      } else if (currencyName === 'HBD') {
        setValue(parseFloat(user.account.hbd_balance as string));
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
        setValue(
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
      }
    }
  }, [user]);

  const onHandleGoToWalletHistory = () => {
    clearWalletFilters();
    navigate('WalletHistoryScreen', {
      currency: currencyName.toLowerCase(),
    } as WalletHistoryComponentProps);
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
    }
  };

  return (
    <View style={getCardStyle(theme).wrapperCardItem}>
      <View style={styles.container} key={`currency-token-${currencyName}`}>
        <TouchableOpacity
          onPress={() => {
            onPress();
            setIsExpanded(!isExpanded);
          }}
          style={styles.rowContainer}>
          <View style={styles.leftContainer}>
            {getCurrencyLogo()}
            <Text style={[styles.textSymbol, styles.marginLeft]}>
              {currencyName}
            </Text>
          </View>
          <View style={isExpanded ? styles.rowContainer : undefined}>
            <View>
              <Text style={[styles.textAmount, styles.alignedRitgh]}>
                {value ? formatBalance(value) : 0}
              </Text>
              {subValue && (
                <Text
                  style={[
                    styles.textAmount,
                    styles.opaque,
                    styles.alignedRitgh,
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
                onClick={onHandleGoToWalletHistory}
                additionalContainerStyle={styles.squareButton}
                theme={theme}
                color={PRIMARY_RED_COLOR}
              />
            )}
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View>
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
    alignedRitgh: {
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
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    properties: state.properties,
  };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CurrencyToken);
