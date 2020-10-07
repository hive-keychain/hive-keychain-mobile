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
import SendArrow from 'assets/wallet/icon_send.svg';
import SendArrowBlue from 'assets/wallet/icon_send_blue.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'navigationRef';
import {loadAccount} from 'actions';

const Transfer = ({currency, user, loadAccountConnect}) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const onTransfer = async () => {
    Keyboard.dismiss();
    try {
      await client.broadcast.transfer(
        {
          amount: `${parseFloat(amount).toFixed(3)} ${currency}`,
          memo,
          to: to.toLowerCase(),
          from: user.account.name,
        },
        hive.PrivateKey.fromString(user.keys.active),
      );
      loadAccountConnect(user.account.name);
      goBack();
      Toast.show(translate('toast.transfer_success'), Toast.LONG);
    } catch (e) {
      Toast.show(`Error : ${e.message}`, Toast.LONG);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      buttonBackgroundColor="#77B9D1"
      logoButton={<SendArrow />}
      logo={<SendArrowBlue />}
      title={translate('wallet.operations.transfer.title')}>
      <Separator />
      <Balance currency={currency} account={user.account} />

      <Separator />
      <OperationInput
        placeholder={translate('common.username').toUpperCase()}
        leftIcon={<AccountLogoDark />}
        value={to}
        onChangeText={setTo}
      />
      <Separator />
      <OperationInput
        placeholder={'0.000'}
        rightIcon={<Text style={styles.currency}>{currency}</Text>}
        textAlign="right"
        value={amount}
        onChangeText={setAmount}
      />
      <Separator />
      <OperationInput
        placeholder={translate('wallet.operations.transfer.memo')}
        value={memo}
        onChangeText={setMemo}
      />

      <Separator height={40} />
      <EllipticButton title="Send" onPress={onTransfer} style={styles.button} />
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
)(Transfer);
