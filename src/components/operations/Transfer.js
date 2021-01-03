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
import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import SendArrowBlue from 'assets/wallet/icon_send_blue.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'utils/navigation';
import {loadAccount} from 'actions';
import {hiveEngine} from 'utils/config';
import {tryConfirmTransaction} from 'utils/hiveEngine';

const Transfer = ({
  currency,
  user,
  loadAccountConnect,
  engine,
  tokenBalance,
  tokenLogo,
}) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  const transfer = async () => {
    setLoading(true);
    await client.broadcast.transfer(
      {
        amount: `${parseFloat(amount).toFixed(3)} ${currency}`,
        memo,
        to: to.toLowerCase(),
        from: user.account.name,
      },
      hive.PrivateKey.fromString(user.keys.active),
    );
  };

  const transferToken = async () => {
    setLoading(true);

    const id = hiveEngine.CHAIN_ID;
    const json = JSON.stringify({
      contractName: 'tokens',
      contractAction: 'transfer',
      contractPayload: {
        symbol: currency,
        to: to.toLowerCase(),
        quantity: amount,
        memo: memo,
      },
    });
    return await client.broadcast.json(
      {
        id,
        json,
        required_auths: [user.name],
        required_posting_auths: [],
      },
      hive.PrivateKey.fromString(user.keys.active),
    );
  };

  const onSend = async () => {
    Keyboard.dismiss();
    try {
      if (!engine) {
        await transfer();
        Toast.show(translate('toast.transfer_success'), Toast.LONG);
      } else {
        const {id} = await transferToken();
        const {confirmed} = await tryConfirmTransaction(id);
        Toast.show(
          confirmed
            ? translate('toast.transfer_token_confirmed')
            : translate('toast.transfer_token_unconfirmed'),
          Toast.LONG,
        );
      }
      loadAccountConnect(user.account.name);
      goBack();
    } catch (e) {
      Toast.show(`Error : ${e.message}`, Toast.LONG);
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<SendArrowBlue />}
      title={translate('wallet.operations.transfer.title')}>
      <Separator />
      <Balance
        currency={currency}
        account={user.account}
        tokenBalance={tokenBalance}
        tokenLogo={tokenLogo}
        engine={engine}
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
      <Separator />
      <OperationInput
        placeholder={translate('wallet.operations.transfer.memo')}
        value={memo}
        onChangeText={setMemo}
      />

      <Separator height={40} />

      <ActiveOperationButton
        title={translate('common.send')}
        onPress={onSend}
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
)(Transfer);
