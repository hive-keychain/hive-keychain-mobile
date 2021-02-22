import React, {useState} from 'react';
import {StyleSheet, Text, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Operation from './Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import Balance from './Balance';

import Hp from 'assets/wallet/icon_hp_dark.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'utils/navigation';
import {loadAccount} from 'actions';
import {toHP, fromHP, withCommas} from 'utils/format';
import {powerDown} from 'utils/hive';

const PowerDown = ({currency = 'HP', user, loadAccountConnect, properties}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    Keyboard.dismiss();

    try {
      await powerDown(user.keys.active, {
        vesting_shares: `${fromHP(amount, properties.globals).toFixed(
          6,
        )} VESTS`,
        account: user.account.name,
      });
      loadAccountConnect(user.account.name);
      goBack();
      if (parseFloat(amount) !== 0) {
        Toast.show(translate('toast.powerdown_success'), Toast.LONG);
      } else {
        Toast.show(translate('toast.stop_powerdown_success'), Toast.LONG);
      }
    } catch (e) {
      Toast.show(`Error : ${e.message}`, Toast.LONG);
    } finally {
      setLoading(false);
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
      <ActiveOperationButton
        title={translate('common.send')}
        onPress={onPowerDown}
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
