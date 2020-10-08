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

import Hp from 'assets/wallet/icon_hp_dark.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'navigationRef';
import {loadAccount} from 'actions';
import {toHP, withCommas} from 'utils/format';

const PowerDown = ({currency = 'HP', user, loadAccountConnect, properties}) => {
  const [amount, setAmount] = useState('');
  const renderPDIndicator = () => {
    if (parseFloat(user.account.to_withdraw) !== 0) {
      return (
        <Text>
          <Text style={styles.bold}>Current power down : </Text>
          {`${withCommas(
            toHP(user.account.withdrawn, properties.globals) / 1000000,
            1,
          )} / ${withCommas(
            toHP(user.account.to_withdraw, properties.globals) / 1000000,
            1,
          )} HP`}
        </Text>
      );
    } else {
      return null;
    }
  };
  const onPowerDown = async () => {
    Keyboard.dismiss();

    try {
      await client.broadcast.sendOperations(
        [
          [
            'transfer_to_vesting',
            {
              amount: `${parseFloat(amount).toFixed(3)} ${currency}`,
              from: user.account.name,
            },
          ],
        ],
        hive.PrivateKey.fromString(user.keys.active),
      );
      loadAccountConnect(user.account.name);
      goBack();
      Toast.show(translate('toast.powerup_success'), Toast.LONG);
    } catch (e) {
      Toast.show(`Error : ${e.message}`, Toast.LONG);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Hp />}
      title={translate('wallet.operations.powerdown.title')}>
      <Separator />
      <Balance
        currency={currency}
        account={user.account}
        pd
        globalProperties={properties.globals}
      />

      <Separator />
      {renderPDIndicator()}
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
        onPress={onPowerDown}
        style={styles.button}
      />
    </Operation>
  );
};

const getDimensionedStyles = (color) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    bold: {fontWeight: 'bold'},
  });

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
      properties: state.properties,
    };
  },
  {loadAccountConnect: loadAccount},
)(PowerDown);
