import React, {useState} from 'react';
import {StyleSheet, Text, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import hive, {client} from 'utils/dhive';
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
import {loadAccount} from 'actions';

const Convert = ({user, loadAccountConnect}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onConvert = async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      await client.broadcast.sendOperations(
        [
          [
            'convert',
            {owner: user.account.name, amount: `${amount} HBD`, requestid: 1},
          ],
        ],
        hive.PrivateKey.fromString(user.keys.active),
      );
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
  });

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
    };
  },
  {loadAccountConnect: loadAccount},
)(Convert);
