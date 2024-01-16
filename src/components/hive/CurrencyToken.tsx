import {clearWalletFilters} from 'actions/walletFilters';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
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
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {formatBalance} from 'utils/format';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Icon from './Icon';
import {WalletHistoryComponentProps} from './Wallet-history-component';

interface Props {
  theme: Theme;
  currencyName: string;
  value: number;
  subValue?: string;
  preFixSubValue?: string;
  subValueShortDescription?: string;
  currencyLogo: JSX.Element;
  buttons: JSX.Element[];
}

const CurrencyToken = ({
  theme,
  currencyName,
  currencyLogo,
  value,
  subValue,
  buttons,
  clearWalletFilters,
  subValueShortDescription,
  preFixSubValue,
}: Props & PropsFromRedux) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const styles = getStyles(theme, useWindowDimensions());

  const onHandleGoToWalletHistory = () => {
    clearWalletFilters();
    navigate('WalletHistoryScreen', {
      currency: currencyName.toLowerCase(),
    } as WalletHistoryComponentProps);
  };

  return (
    <View style={styles.container} key={`currency-token-${currencyName}`}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.rowContainer}>
        <View style={styles.leftContainer}>
          {currencyLogo}
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
                style={[styles.textAmount, styles.opaque, styles.alignedRitgh]}>
                {preFixSubValue ? preFixSubValue : ''} {subValue} (
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
      fontSize: getFontSizeSmallDevices(height, body_primary_body_2.fontSize),
    },
    textSymbol: {
      ...button_link_primary_medium,
      lineHeight: 22,
      color: getColors(theme).symbolText,
      fontSize: getFontSizeSmallDevices(
        height,
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
  });

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {
  clearWalletFilters,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CurrencyToken);
