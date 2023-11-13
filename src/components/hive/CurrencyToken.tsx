import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
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
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const styles = getStyles(theme, useWindowDimensions().height);
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
                + {subValue} ({translate('common.savings')})
              </Text>
            )}
          </View>
          {isExpanded && (
            <Icon
              key={`show-token-history-${currencyName}`}
              name={'back_time'}
              onClick={() =>
                navigate('WALLET', {
                  screen: 'WalletHistoryScreen',
                  params: {
                    currency: currencyName.toLowerCase(),
                  } as WalletHistoryComponentProps,
                })
              }
              additionalContainerStyle={styles.squareButton}
              theme={theme}
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

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      borderRadius: 20,
      width: '100%',
      backgroundColor: getColors(theme).secondaryCardBgColor,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 10,
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
      color: getColors(theme).quaternaryText,
      lineHeight: 17,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(height, body_primary_body_2.fontSize),
    },
    textSymbol: {
      ...button_link_primary_medium,
      lineHeight: 22,
      color: getColors(theme).tertiaryText,
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

export default CurrencyToken;
