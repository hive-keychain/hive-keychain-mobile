import React, {useState} from 'react';
import {StyleSheet, Button} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';

import PasswordInput from '../components/PasswordInput';
import Separator from '../components/Separator';
import {unlock, forgetAccounts} from '../actions';

const Unlock = ({unlock, forgetAccounts}) => {
  const [pwd, setPwd] = useState('testtest');
  const onSubmitUnlock = () => {
    unlock(pwd);
  };
  return (
    <>
      <Text h3 style={styles.textCentered}>
        Welcome to Keychain
      </Text>

      <Separator height={50} />
      <PasswordInput
        label="Master Password"
        value={pwd}
        onChangeText={setPwd}
      />

      <Separator height={80} />
      <Button title="Submit" onPress={onSubmitUnlock} />
      <Button title="Forget" onPress={forgetAccounts} />
    </>
  );
};

const styles = StyleSheet.create({
  textCentered: {textAlign: 'center'},
});

export default connect(null, {unlock, forgetAccounts})(Unlock);
