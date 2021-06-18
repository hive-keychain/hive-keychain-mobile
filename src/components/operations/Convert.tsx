import {fetchConversionRequests, loadAccount} from 'actions/index';
import Hive from 'assets/wallet/icon_hive.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {convert} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';

const Convert = ({
  user,
  loadAccount,
  fetchConversionRequests,
  conversions,
}: PropsFromRedux) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConversionsList, setShowConversionsList] = useState(false);

  useEffect(() => {
    fetchConversionRequests(user.name!);
  }, [user.name, fetchConversionRequests]);

  const onConvert = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      await convert(user.keys.active!, {
        owner: user.account.name,
        amount: sanitizeAmount(amount, 'HBD'),
        requestid: Math.max(...conversions.map((e) => e.requestid), 0) + 1,
      });
      loadAccount(user.account.name, true);
      goBack();
      Toast.show(translate('toast.convert_success'), Toast.LONG);
    } catch (e) {
      Toast.show(`Error : ${e.message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties('HBD');
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Hive />}
      title={translate('wallet.operations.convert.title')}>
      <Separator />
      <Balance currency="HBD" account={user.account} />
      <Separator />
      <OperationInput
        placeholder={'0.000'}
        keyboardType="numeric"
        rightIcon={<Text style={styles.currency}>HBD</Text>}
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
                  {amt} <Text style={styles.green}>{currency}</Text>
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
      ) : (
        <View style={styles.conversionContainer} />
      )}

      <Separator height={40} />
      <ActiveOperationButton
        title={translate('wallet.operations.convert.button')}
        onPress={onConvert}
        style={styles.button}
        isLoading={loading}
      />
    </Operation>
  );
};

const getDimensionedStyles = (color: string) =>
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
