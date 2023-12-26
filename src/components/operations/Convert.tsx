import {fetchConversionRequests, loadAccount} from 'actions/index';
import {Conversion} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import PendingConvertions from 'components/hive/PendingConvertions';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getRotateStyle} from 'src/styles/transform';
import {
  FontJosefineSansName,
  button_link_primary_medium,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize} from 'utils/format';
import {collateralizedConvert, convert} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import Balance from './Balance';
import OperationThemed from './OperationThemed';

export interface ConvertOperationProps {
  currency: 'HBD' | 'HIVE';
}

type Props = PropsFromRedux & ConvertOperationProps;
const Convert = ({
  user,
  loadAccount,
  fetchConversionRequests,
  conversions,
  currency,
}: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConversionsList, setShowConversionsList] = useState(false);
  const [totalPendingConvertions, setTotalPendingConvertions] = useState(0);

  useEffect(() => {
    fetchConversionRequests(user.name!, currency);
  }, [user.name, fetchConversionRequests]);

  useEffect(() => {
    if (conversions.length > 0) {
      setTotalPendingConvertions(
        conversions
          .filter(
            (conversion) =>
              moment(conversion.conversion_date).isAfter() &&
              conversion.amount.split(' ')[1] === currency,
          )
          .reduce(
            (acc, current) => acc + parseFloat(current.amount.split(' ')[0]),
            0,
          ),
      );
    }
  }, [conversions]);

  const onConvert = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      if (currency === 'HBD') {
        await convert(user.keys.active!, {
          owner: user.account.name,
          amount: sanitizeAmount(amount, 'HBD'),
          requestid: Math.max(...conversions.map((e) => e.requestid), 0) + 1,
        });
      } else {
        await collateralizedConvert(user.keys.active!, {
          owner: user.account.name,
          amount: sanitizeAmount(amount, 'HIVE'),
          requestid: Math.max(...conversions.map((e) => e.requestid), 0) + 1,
        });
      }
      loadAccount(user.account.name, true);
      goBack();
      Toast.show(translate('toast.convert_success', {currency}), Toast.LONG);
    } catch (e) {
      Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  const {theme} = useContext(ThemeContext);
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);

  const renderConvertionItem = (item: Conversion) => {
    const [amt, c] = item.amount.split(' ');
    return currency === c ? (
      <View style={styles.conversionRow}>
        <Text style={[styles.textBase]}>
          {amt} {currency}
        </Text>
        <Text style={[styles.textBase]}>-</Text>
        <Text style={[styles.textBase]}>
          {item.conversion_date
            .replace('T', ' ')
            .replace('-', '/')
            .replace('-', '/')}
        </Text>
      </View>
    ) : null;
  };

  return (
    <OperationThemed
      additionalContentContainerStyle={styles.paddingHorizontal}
      childrenTop={
        <>
          <Separator />
          <Balance
            theme={theme}
            currency={currency}
            account={user.account}
            setMax={(value: string) => {
              setAmount(value);
            }}
          />
          <Separator />
          {totalPendingConvertions > 0 && (
            <TouchableOpacity
              onPress={() => {
                navigate('TemplateStack', {
                  titleScreen: capitalize(
                    translate(`wallet.operations.convert.pending`),
                  ),
                  component: (
                    <PendingConvertions
                      currency={currency}
                      currentPendingConvertionList={conversions}
                    />
                  ),
                } as TemplateStackProps);
              }}
              style={[
                getCardStyle(theme).defaultCardItem,
                styles.displayAction,
              ]}>
              <View>
                <Text
                  style={[styles.textBase, styles.josefineFont, styles.opaque]}>
                  {capitalize(translate(`common.pending`))}
                </Text>
                <Text
                  style={[styles.textBase, styles.title, styles.josefineFont]}>
                  {totalPendingConvertions} {currency}
                </Text>
              </View>
              <Icon
                theme={theme}
                name={Icons.EXPAND_THIN}
                additionalContainerStyle={getRotateStyle('90')}
              />
            </TouchableOpacity>
          )}
          <Separator height={25} />
        </>
      }
      childrenMiddle={
        <>
          <Separator />
          <Text
            style={[
              styles.textBase,
              styles.opaque,
              styles.disclaimer,
              styles.paddingHorizontal,
            ]}>
            {translate(
              `wallet.operations.convert.disclaimer_${currency.toLowerCase()}`,
            )}
          </Text>
          <Separator />
          <View style={styles.flexRowBetween}>
            <OperationInput
              labelInput={translate('common.currency')}
              placeholder={currency}
              value={currency}
              editable={false}
              additionalOuterContainerStyle={{
                width: '40%',
              }}
              inputStyle={styles.textBase}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
            />
            <OperationInput
              labelInput={capitalize(translate('common.amount'))}
              placeholder={'0.000'}
              keyboardType="decimal-pad"
              textAlign="right"
              value={amount}
              inputStyle={[styles.textBase, styles.paddingLeft]}
              onChangeText={setAmount}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
              additionalOuterContainerStyle={{
                width: '54%',
              }}
              rightIcon={
                <View style={styles.flexRowCenter}>
                  <Separator
                    drawLine
                    additionalLineStyle={getHorizontalLineStyle(
                      theme,
                      1,
                      35,
                      16,
                    )}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setAmount(
                        (user.account.hbd_balance as string).split(' ')[0],
                      )
                    }>
                    <Text style={[styles.textBase, styles.redText]}>
                      {translate('common.max').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
          <Separator />
          <TouchableOpacity
            onPress={() => {
              setShowConversionsList(!showConversionsList);
            }}>
            <Text
              style={
                styles.textBase
              }>{`${conversions.length} conversions`}</Text>
          </TouchableOpacity>
          <Separator />
          {showConversionsList ? (
            <FlatList
              data={conversions}
              style={styles.conversionContainer}
              renderItem={({item}) => renderConvertionItem(item)}
              keyExtractor={(conversion) => conversion.id + ''}
            />
          ) : null}
        </>
      }
      childrenBottom={
        <>
          <ActiveOperationButton
            title={translate('wallet.operations.convert.button')}
            onPress={onConvert}
            style={[getButtonStyle(theme).warningStyleButton]}
            additionalTextStyle={{...button_link_primary_medium}}
            isLoading={loading}
          />
          <Separator />
        </>
      }
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    conversionRow: {
      width: '70%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    conversionContainer: {
      height: 80,
    },
    disclaimer: {textAlign: 'justify', fontSize: 14},
    displayAction: {
      marginHorizontal: 15,
      borderRadius: 26,
      paddingHorizontal: 21,
      paddingVertical: 13,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    textBase: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    title: {
      fontSize: 15,
    },
    josefineFont: {
      fontFamily: FontJosefineSansName.MEDIUM,
    },
    opaque: {
      opacity: 0.7,
    },
    paddingHorizontal: {paddingHorizontal: 15},
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paddingLeft: {
      paddingLeft: 10,
    },
    redText: {color: PRIMARY_RED_COLOR},
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      conversions: state.conversions,
    };
  },
  {
    loadAccount,
    fetchConversionRequests,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Convert);
