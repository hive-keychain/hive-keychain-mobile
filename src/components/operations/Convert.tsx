import {fetchConversionRequests, loadAccount} from 'actions/index';
import Hive from 'assets/wallet/icon_hive.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
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
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {
  FontJosefineSansName,
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
import Operation from './Operation';
import OperationThemed from './OperationThemed';

export interface ConvertOperationProps {
  currency: string;
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
    fetchConversionRequests(user.name!);
  }, [user.name, fetchConversionRequests]);

  useEffect(() => {
    if (conversions.length > 0) {
      console.log({conversions}); //TODO remove line
      //TODO finish bellow, using date & compare to know which ones are not done yet?
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

  return (
    <OperationThemed
      additionalContentContainerStyle={styles.paddingHorizontal}
      childrenTop={
        <>
          <Separator />
          <Balance
            theme={theme}
            using_new_ui
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
                    translate(`wallet.operations.savings.pending`),
                  ),
                  component: (
                    <View>
                      <Text>TODO as new</Text>
                    </View>
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
                name="expand_thin"
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
          <Text style={styles.disclaimer}>
            {translate(
              `wallet.operations.convert.disclaimer_${currency.toLowerCase()}`,
            )}
          </Text>
          <Separator />
          <OperationInput
            placeholder={'0.000'}
            keyboardType="numeric"
            rightIcon={<Text style={styles.currency}>{currency}</Text>}
            textAlign="right"
            value={amount}
            onChangeText={setAmount}
          />
          <Separator />
          <TouchableOpacity
            onPress={() => {
              setShowConversionsList(!showConversionsList);
            }}>
            <Text
              style={
                styles.conversions
              }>{`${conversions.length} conversions`}</Text>
          </TouchableOpacity>
          <Separator />
          {showConversionsList ? (
            <FlatList
              data={conversions}
              style={styles.conversionContainer}
              renderItem={({item}) => {
                const [amt, currency] = item.amount.split(' ');
                return (
                  <View style={styles.conversionRow}>
                    <Text>
                      {amt}{' '}
                      <Text
                        style={currency === 'HBD' ? styles.green : styles.red}>
                        {currency}
                      </Text>
                    </Text>
                    <Text>-</Text>
                    <Text>
                      {item.conversion_date
                        .replace('T', ' ')
                        .replace('-', '/')
                        .replace('-', '/')}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={(conversion) => conversion.id + ''}
            />
          ) : null}
        </>
      }
      childrenBottom={
        <ActiveOperationButton
          title={translate('wallet.operations.convert.button')}
          onPress={onConvert}
          style={styles.button}
          isLoading={loading}
        />
      }
    />
  );
  //TODO cleanup unused code
  return (
    <Operation
      logo={<Hive />}
      title={translate('wallet.operations.convert.title', {
        to: currency === 'HIVE' ? 'HBD' : 'HIVE',
      })}>
      <>
        <Separator />
        <Balance
          currency={currency}
          account={user.account}
          setMax={(value: string) => {
            setAmount(value);
          }}
        />
        <Separator />
        <Text style={styles.disclaimer}>
          {translate(
            `wallet.operations.convert.disclaimer_${currency.toLowerCase()}`,
          )}
        </Text>
        <Separator />
        <OperationInput
          placeholder={'0.000'}
          keyboardType="numeric"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        />
        <Separator />
        <TouchableOpacity
          onPress={() => {
            setShowConversionsList(!showConversionsList);
          }}>
          <Text
            style={
              styles.conversions
            }>{`${conversions.length} conversions`}</Text>
        </TouchableOpacity>
        <Separator />
        {showConversionsList ? (
          <FlatList
            data={conversions}
            style={styles.conversionContainer}
            renderItem={({item}) => {
              const [amt, currency] = item.amount.split(' ');
              return (
                <View style={styles.conversionRow}>
                  <Text>
                    {amt}{' '}
                    <Text
                      style={currency === 'HBD' ? styles.green : styles.red}>
                      {currency}
                    </Text>
                  </Text>
                  <Text>-</Text>
                  <Text>
                    {item.conversion_date
                      .replace('T', ' ')
                      .replace('-', '/')
                      .replace('-', '/')}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(conversion) => conversion.id + ''}
          />
        ) : null}

        <Separator />
        <ActiveOperationButton
          title={translate('wallet.operations.convert.button')}
          onPress={onConvert}
          style={styles.button}
          isLoading={loading}
        />
      </>
    </Operation>
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    conversions: {
      fontWeight: 'bold',
    },
    conversionRow: {
      width: '70%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    conversionContainer: {
      height: 80,
    },
    green: {color: '#005C09'},
    red: {color: '#A3112A'},
    disclaimer: {textAlign: 'justify'},
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
