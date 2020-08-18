import React, {useState} from 'react';
import {StyleSheet, Picker} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';
import Background from '../../components/Background';
import Separator from '../../components/Separator';
import {withCommas} from '../../utils/format';
import CustomInput from '../../components/CustomInput';
import EllipticButton from '../../components/EllipticButton';
import UserLogo from '../../assets/addAccount/icon_username.svg';
import {translate} from '../../utils/localize';

const Transfer = ({user, route}) => {
  const initialCurrency = route.params
    ? route.params.initialCurrency || 'HIVE'
    : 'HIVE';
  const [currency, setCurrency] = useState(initialCurrency);
  const [receiver, setReceiver] = useState('');
  const [selectedValue, setSelectedValue] = useState(initialCurrency);
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
        value={receiver}
        onChangeText={setReceiver}
      />
      <CustomInput
        placeholder={translate('common.amount').toUpperCase()}
        leftIcon={<UserLogo />}
        value={receiver}
        onChangeText={setReceiver}
      />
      <CustomInput
        placeholder={translate('common.memo').toUpperCase()}
        leftIcon={<UserLogo />}
        value={receiver}
        onChangeText={setReceiver}
      />
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          setSelectedValue(itemValue);
          setCurrency(itemValue);
        }}>
        <Picker.Item label="HIVE" value="HIVE" />
        <Picker.Item label="HBD" value="HBD" />
      </Picker>
      <EllipticButton title="Send" onPress={() => {}} />
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
