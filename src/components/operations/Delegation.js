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

import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'utils/navigation';
import {loadAccount} from 'actions';
import {fromHP} from 'utils/format';
import {delegate} from 'utils/hive';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';

const Delegation = ({
  currency = 'HP',
  user,
  loadAccount,
  properties,
  delegatee,
}) => {
  const [to, setTo] = useState(delegatee || '');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onDelegate = async () => {
    setLoading(true);

    Keyboard.dismiss();
    try {
      const delegation = await delegate(user.keys.active, {
        vesting_shares: sanitizeAmount(
          fromHP(sanitizeAmount(amount), properties.globals).toString(),
          'VESTS',
          6,
        ),
        delegatee: sanitizeUsername(to),
        delegator: user.account.name,
      });
      console.log(delegation);
      loadAccount(user.account.name, true);
      goBack();
      if (parseFloat(amount.replace(',', '.')) !== 0) {
        Toast.show(translate('toast.delegation_success'), Toast.LONG);
      } else {
        Toast.show(translate('toast.stop_delegation_success'), Toast.LONG);
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
        keyboardType="decimal-pad"
        rightIcon={<Text style={styles.currency}>{currency}</Text>}
        textAlign="right"
        value={amount}
        onChangeText={setAmount}
      />

      <Separator height={40} />
      <ActiveOperationButton
        title={translate('common.send')}
        onPress={onDelegate}
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
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount},
)(Delegation);
