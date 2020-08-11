import React, {useEffect} from 'react';
import {StyleSheet, Button} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {lock, loadAccount, loadProperties} from '../actions';
import {withCommas, toHP} from '../utils/format';

const Main = ({
  lockConnect,
  loadAccountConnect,
  loadPropertiesConnect,
  user,
  globalProperties,
}) => {
  useEffect(() => {
    loadAccountConnect('keychain');
    loadPropertiesConnect();
  }, [loadAccountConnect, loadPropertiesConnect]);
  if (!user) {
    return null;
  }
  return (
    <>
      <Text h3 style={styles.textCentered}>
        Main
      </Text>
      <Text>{`${withCommas(user.account.balance)} HIVE`}</Text>
      <Text>{`${withCommas(user.account.sbd_balance)} HBD`}</Text>
      <Text>
        {globalProperties &&
          `${withCommas(
            toHP(user.account.vesting_shares, globalProperties),
          )} HP`}
      </Text>
      <Button title="Lock" onPress={lockConnect} />
    </>
  );
};

const styles = StyleSheet.create({
  textCentered: {textAlign: 'center'},
});

export default connect(
  (state) => {
    console.log(state);
    return {
      user: state.activeAccount,
      globalProperties: state.globalProperties,
    };
  },
  {
    lockConnect: lock,
    loadAccountConnect: loadAccount,
    loadPropertiesConnect: loadProperties,
  },
)(Main);
