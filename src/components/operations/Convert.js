import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Keyboard,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Operation from './Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import Balance from './Balance';

import Hive from 'assets/wallet/icon_hive.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'utils/navigation';
import {loadAccount, fetchConversionRequests} from 'actions';
import {convert} from 'utils/hive';

const Convert = ({
  user,
  loadAccountConnect,
  fetchConversionRequestsConnect,
  conversions,
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConversionsList, setShowConversionsList] = useState(false);

  useEffect(() => {
    fetchConversionRequestsConnect(user.name);
  }, [user.name, fetchConversionRequestsConnect]);

  const onConvert = async () => {
    Keyboard.dismiss();
    setLoading(true);
    console.log(
      conversions,
      Math.max(...conversions.map((e) => e.requestid), 0) + 1,
    );
    try {
      await convert(user.keys.active, {
        owner: user.account.name,
        amount: `${amount} HBD`,
        requestid: Math.max(...conversions.map((e) => e.requestid), 0) + 1,
      });
      loadAccountConnect(user.account.name);
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
          keyExtractor={(conversion) => conversion.id}
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

const getDimensionedStyles = (color) =>
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

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
      conversions: state.conversions,
    };
  },
  {
    loadAccountConnect: loadAccount,
    fetchConversionRequestsConnect: fetchConversionRequests,
  },
)(Convert);
