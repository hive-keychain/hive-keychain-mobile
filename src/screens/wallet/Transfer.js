import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {Picker} from '@react-native-community/picker';

import Background from 'components/ui/Background';
import Separator from 'components/ui/Separator';
import {withCommas} from 'utils/format';
import CustomInput from 'components/form/CustomInput';
import EllipticButton from 'components/form/EllipticButton';
import UserLogo from 'assets/addAccount/icon_username.svg';
import {translate} from 'utils/localize';
import hive, {client} from 'utils/dhive';

const Transfer = ({user, route}) => {
  const initialCurrency = route.params
    ? route.params.initialCurrency || 'HIVE'
    : 'HIVE';
  const [currency, setCurrency] = useState(initialCurrency);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const onTransfer = async () => {
    console.log(
      {amount, memo, to, from: user.account.name},
      hive.PrivateKey.fromString(user.keys.active),
    );
    const res = await client.broadcast.transfer(
      {
        amount: `${parseFloat(amount).toFixed(3)} ${currency}`,
        memo,
        to: to.toLowerCase(),
        from: user.account.name,
      },
      hive.PrivateKey.fromString(user.keys.active),
    );
    console.log('transfer', res);
  };
  return (
    <Background>
      <Separator height={50} />
      <Text h3 style={styles.textCentered}>
        {`${currency} Balance`}
      </Text>
      <Text h3 style={styles.textCentered}>
        {currency === 'HIVE'
          ? withCommas(user.account.balance)
          : withCommas(user.account.sbd_balance)}
      </Text>
      <CustomInput
        placeholder={translate('common.username').toUpperCase()}
        leftIcon={<UserLogo />}
        value={to}
        onChangeText={setTo}
      />
      <CustomInput
        placeholder={translate('common.amount').toUpperCase()}
        leftIcon={<UserLogo />}
        value={amount}
        onChangeText={setAmount}
      />
      <CustomInput
        placeholder={translate('common.memo').toUpperCase()}
        leftIcon={<UserLogo />}
        value={memo}
        onChangeText={setMemo}
      />
      <Picker selectedValue={currency} onValueChange={setCurrency}>
        <Picker.Item label="HIVE" value="HIVE" />
        <Picker.Item label="HBD" value="HBD" />
      </Picker>
      <EllipticButton title="Send" onPress={onTransfer} />
    </Background>
  );
};

const styles = StyleSheet.create({
  textCentered: {textAlign: 'center', color: 'white'},
});

export default connect((state) => {
  return {
    user: state.activeAccount,
  };
})(Transfer);
