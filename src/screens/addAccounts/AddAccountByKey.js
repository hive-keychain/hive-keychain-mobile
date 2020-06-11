import React, {useState} from 'react';
import {StyleSheet, Button} from 'react-native';
import {Text} from 'react-native-elements';
import Separator from '../../components/Separator';
import {connect} from 'react-redux';
import {addAccount} from '../../actions';
import PasswordInput from '../../components/PasswordInput';
import AccountInput from '../../components/AccountInput';
import validateNewAccount from '../../utils/validateNewAccount';

const AddAccountByKey = ({navigation}) => {
  const [account, setAccount] = useState('');
  const [key, setKey] = useState('');

  const onImportKeys = async () => {
    const keys = await validateNewAccount(account, key);
    console.log(keys);
  };
  return (
    <>
      <Separator />
      <Text>
        Enter your Hive account name and either the master password or the
        private posting or active key for that account below. Your master
        password will NOT be saved and will only be used to generate your
        private keys. You may add / remove Hive accounts or keys at any time. If
        you need to create a new Hive account, you can do so at signup.hive.io/.
      </Text>
      <Separator />
      <AccountInput label="Account" value={account} onChangeText={setAccount} />
      <Separator />

      <PasswordInput
        label="Password or Private Key"
        value={key}
        onChangeText={setKey}
      />
      <Separator height={50} />
      <Button title="Import Keys" onPress={onImportKeys} />
    </>
  );
};

const styles = StyleSheet.create({});

export default connect(null, {addAccount})(AddAccountByKey);
