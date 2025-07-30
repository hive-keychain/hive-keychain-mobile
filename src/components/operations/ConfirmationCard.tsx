import {Account} from 'actions/interfaces';
import CollapsibleData from 'components/browser/requestOperations/components/CollapsibleData';
import CurrencyIcon from 'components/hive/CurrencyIcon';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import {FormatUtils} from 'hive-keychain-commons';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {Token} from 'src/interfaces/tokens.interface';
import {getButtonHeight} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getFormFontStyle} from 'src/styles/typography';
import {Colors} from 'utils/colors';
import {KeychainRequest, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {ConfirmationData} from './Confirmation';

export enum ConfirmationDataTag {
  AMOUNT = 'amount',
  BALANCE = 'balance',
  USERNAME = 'username',
  OPERATION_TYPE = 'operation_type',
  COLLAPSIBLE = 'COLLAPSIBLE',
  REQUEST_USERNAME = 'REQUEST_USERNAME',
}
export const createBalanceData = (
  title: string,
  currentBalance: number,
  amount: number,
  currency: string,
): ConfirmationData => {
  const finalBalance = Number(currentBalance) - Number(amount);
  return {
    title,
    value: `${currentBalance} ${currency}`,
    tag: ConfirmationDataTag.BALANCE,
    currency,
    currentBalance: FormatUtils.withCommas(currentBalance.toString(), 3),
    amount: FormatUtils.withCommas(amount.toString(), 3),
    finalBalance: FormatUtils.withCommas(finalBalance.toString(), 3),
  };
};

const ConfirmationCard = ({
  data,
  tokens,
  colors,
  request,
  accounts,
  RequestUsername,
}: {
  data: ConfirmationData[];
  tokens: Token[];
  colors: Colors;
  request?: KeychainRequest & RequestId;
  accounts?: Account[];
  RequestUsername?: () => JSX.Element;
}) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getDimensionedStyles(width, theme);
  const renderConfirmationValue = (e: ConfirmationData) => {
    switch (e.tag) {
      case ConfirmationDataTag.USERNAME:
        return <UsernameWithAvatar username={e.value} alignAllToLeft={false} />;
      case ConfirmationDataTag.AMOUNT:
        return (
          <View style={styles.amount}>
            <Text
              style={[
                getFormFontStyle(width, theme).title,
                styles.textContent,
              ]}>
              {e.value + ` ${e.currency ? e.currency : ''}`}
            </Text>
            <CurrencyIcon
              currencyName={e.currency as any}
              tokenInfo={tokens.find((t) => t.symbol === e.currency)}
              addBackground
              colors={colors}
              symbol={e.currency}
            />
          </View>
        );
      case ConfirmationDataTag.BALANCE:
        if (
          e.currentBalance !== undefined &&
          e.amount !== undefined &&
          e.finalBalance !== undefined
        ) {
          const isInsufficient = Number(e.finalBalance) < 0;
          return (
            <View style={styles.balanceRow}>
              {isInsufficient ? (
                <Text style={styles.errorText}>Insufficient Balance</Text>
              ) : (
                <>
                  <View style={styles.balanceColumn}>
                    <Text
                      style={[
                        getFormFontStyle(width, theme).title,
                        styles.textContent,
                      ]}>
                      {`${e.currentBalance} ${e.currency || ''}`}
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Icon
                      name={Icons.ARROW_RIGHT_BROWSER}
                      additionalContainerStyle={styles.arrowIcon}
                      width={16}
                      height={16}
                      theme={theme}
                      color={getColors(theme).iconBW}
                    />
                  </View>
                  <View style={styles.balanceColumn}>
                    <Text
                      style={[
                        getFormFontStyle(width, theme).title,
                        styles.textContent,
                      ]}>
                      {`${e.finalBalance} ${e.currency || ''}`}
                    </Text>
                  </View>
                </>
              )}
            </View>
          );
        }
        return (
          <Text
            style={[getFormFontStyle(width, theme).title, styles.textContent]}>
            {e.value + ` ${e.currency ? e.currency : ''}`}
          </Text>
        );
      case ConfirmationDataTag.COLLAPSIBLE:
        return (
          <CollapsibleData
            title={e.title}
            hidden={e.hidden}
            content={e.value}
          />
        );
      case ConfirmationDataTag.REQUEST_USERNAME:
        if (RequestUsername) {
          return <RequestUsername />;
        }
        return null;
      default:
        return (
          <View style={{flexShrink: 1}}>
            <Text
              style={[
                getFormFontStyle(width, theme).title,
                styles.textContent,
              ]}>
              {e.value}
            </Text>
          </View>
        );
    }
  };
  console.log(data);
  return (
    <View
      style={[getCardStyle(theme).defaultCardItem, {marginBottom: 0, flex: 1}]}>
      {data.map((e, i) => (
        <View
          style={[styles.confirmItem, styles.justifyContent]}
          key={`${e.title}-${i}`}>
          <View style={[styles.flexRowBetween]}>
            {e.tag !== ConfirmationDataTag.REQUEST_USERNAME && (
              <Text
                style={[
                  getFormFontStyle(width, theme).title,
                  {fontWeight: 'bold', paddingRight: 4},
                ]}>
                {translate(e.title)}
              </Text>
            )}
            {renderConfirmationValue(e)}
          </View>
          {i !== data.length - 1 && (
            <Separator
              drawLine
              height={0.5}
              additionalLineStyle={styles.bottomLine}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const getDimensionedStyles = (width: number, theme: Theme) =>
  StyleSheet.create({
    confirmItem: {
      marginVertical: 8,
      flex: 1,
    },
    warning: {color: 'red'},
    flexRowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    info: {
      opacity: 0.7,
    },
    textContent: {
      color: getColors(theme).secondaryText,
      textAlign: 'right',
      flexWrap: 'wrap',
    },
    bottomLine: {
      width: '100%',
      borderColor: getColors(theme).secondaryLineSeparatorStroke,
      margin: 0,
      marginTop: 12,
    },
    justifyContent: {justifyContent: 'center'},
    operationButton: {
      marginHorizontal: 0,
      height: getButtonHeight(width),
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
    },
    paddingHorizontal: {
      paddingHorizontal: 18,
    },

    balanceRow: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
      flexShrink: 1,
    },
    balanceColumn: {
      flexShrink: 1,
    },
    arrowContainer: {
      alignItems: 'center',
      transform: [{rotate: '90deg'}],
    },
    arrowIcon: {
      marginHorizontal: 0,
    },
    opaque: {
      opacity: 0.7,
    },
    errorText: {
      color: PRIMARY_RED_COLOR,
    },
    amount: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });

export default ConfirmationCard;
