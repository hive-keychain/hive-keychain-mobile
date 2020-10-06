import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import hive, {client} from 'utils/dhive';

import Operation from './Operation';
import {translate} from 'utils/localize';
import CustomInput from 'components/CustomInput';
import EllipticButton from 'components/EllipticButton';
import Separator from 'components/Separator';
import Balance from './Balance';
import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import SendArrow from 'assets/wallet/icon_send.svg';
import SendArrowBlue from 'assets/wallet/icon_send_blue.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'navigationRef';

const Transfer = ({currency, user}) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const onTransfer = async () => {
    try {
      const res = await client.broadcast.transfer(
        {
          amount: `${parseFloat(amount).toFixed(3)} ${currency}`,
          memo,
          to: to.toLowerCase(),
          from: user.account.name,
        },
        hive.PrivateKey.fromString(user.keys.active),
      );
      goBack();
    } catch (e) {
      goBack();
      console.log('transfer', e);
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
      <CustomInput
        placeholder={translate('common.username').toUpperCase()}
        leftIcon={<AccountLogoDark />}
        value={to}
        placeholderTextColor="#7E8C9A"
        backgroundColor="#ffffff"
        inputColor="#68A0B4"
        onChangeText={setTo}
      />
      <Separator />
      <CustomInput
        placeholder={'0.000'}
        rightIcon={<Text style={styles.currency}>{currency}</Text>}
        placeholderTextColor="#7E8C9A"
        backgroundColor="#ffffff"
        inputColor="#68A0B4"
        textAlign="right"
        value={amount}
        onChangeText={setAmount}
      />
      <Separator />
      <CustomInput
        placeholder={translate('wallet.operations.transfer.memo')}
        value={memo}
        placeholderTextColor="#7E8C9A"
        backgroundColor="#ffffff"
        inputColor="#68A0B4"
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

export default connect((state) => {
  return {
    user: state.activeAccount,
  };
})(Transfer);
