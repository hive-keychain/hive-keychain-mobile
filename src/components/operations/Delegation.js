import React, {useState} from 'react';
import {StyleSheet, Text, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import hive, {client} from 'utils/dhive';
import Toast from 'react-native-simple-toast';

import Operation from './Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import Balance from './Balance';

import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'utils/navigation';
import {loadAccount} from 'actions';
import {fromHP} from 'utils/format';

const Delegation = ({
  currency = 'HP',
  user,
  loadAccountConnect,
  properties,
  delegatee,
}) => {
  const [to, setTo] = useState(delegatee || '');
  const [amount, setAmount] = useState('');

  const onDelegate = async () => {
    Keyboard.dismiss();
    try {
      await client.broadcast.sendOperations(
        [
          [
            'delegate_vesting_shares',
            {
              vesting_shares: `${fromHP(amount, properties.globals).toFixed(
                6,
              )} VESTS`,
              delegatee: to.toLowerCase(),
              delegator: user.account.name,
            },
          ],
        ],
        hive.PrivateKey.fromString(user.keys.active),
      );
      loadAccountConnect(user.account.name);
      goBack();
      if (parseFloat(amount) !== 0) {
        Toast.show(translate('toast.delegation_success'), Toast.LONG);
      } else {
        Toast.show(translate('toast.stop_delegation_success'), Toast.LONG);
      }
    } catch (e) {
      Toast.show(`Error : ${e.message}`, Toast.LONG);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Delegate />}
      title={translate('wallet.operations.delegation.title')}>
      <Separator />
      <Balance
        currency={currency}
        account={user.account}
        pd
        globalProperties={properties.globals}
      />

      <Separator />
      <OperationInput
        placeholder={translate('common.username').toUpperCase()}
        leftIcon={<AccountLogoDark />}
        autoCapitalize="none"
        value={to}
        onChangeText={setTo}
      />
      <Separator />
      <OperationInput
        placeholder={'0.000'}
        keyboardType="numeric"
        rightIcon={<Text style={styles.currency}>{currency}</Text>}
        textAlign="right"
        value={amount}
        onChangeText={setAmount}
      />

      <Separator height={40} />
      <EllipticButton
        title={translate('common.send')}
        onPress={onDelegate}
        style={styles.button}
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
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccountConnect: loadAccount},
)(Delegation);
