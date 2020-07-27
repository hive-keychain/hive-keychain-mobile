import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';

import {unlock, forgetAccounts} from '../actions';
import Background from '../components/Background';
import Pincode from '../components/PinCode';
import KeychainLogo from '../assets/keychain.svg';

const Unlock = ({unlockConnect, forgetAccountsConnect, navigation}) => {
  return (
    <Background>
      <Pincode
        navigation={navigation}
        title="Enter your PIN"
        confirm="Confirm your PIN"
        submit={unlockConnect}>
        <View style={styles.blackCircle}>
          <KeychainLogo {...styles.image} />
        </View>
      </Pincode>
    </Background>
  );
};

const styles = StyleSheet.create({
  blackCircle: {
    width: 100,
    height: 100,
    backgroundColor: 'black',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {width: 49, height: 41},
  textCentered: {textAlign: 'center'},
});

export default connect(null, {
  unlockConnect: unlock,
  forgetAccountsConnect: forgetAccounts,
})(Unlock);
