import React, {useState} from 'react';
import {StyleSheet, Button} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {BoxPasswordStrengthDisplay} from 'react-native-password-strength-meter';

import PasswordInput from '../components/PasswordInput';
import Separator from '../components/Separator';
import {signUp} from '../actions';

const Signup = ({signUp}) => {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const onSubmitSignup = () => {
    if (pwd.length < 6) {
      setError('Please enter a password.');
    } else if (confirm !== pwd) {
      setError('Passwords mismatch');
    } else {
      signUp(pwd);
    }
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
        style={styles.confirmPwd}
      />
      <BoxPasswordStrengthDisplay labelVisible={false} password={pwd} />
      <Separator height={20} />
      <PasswordInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
      />
      <Text style={styles.error}>{error}</Text>
      <Separator height={80} />
      <Button title="Submit" onPress={onSubmitSignup} />
    </>
  );
};

const styles = StyleSheet.create({
  textCentered: {textAlign: 'center'},
  error: {color: 'red'},
});

export default connect(null, {signUp})(Signup);
