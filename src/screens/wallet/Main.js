import React, {useEffect} from 'react';
import {StyleSheet, Button} from 'react-native';

import {Text} from 'react-native-elements';
import {connect} from 'react-redux';

import {lock, loadAccount, loadProperties} from 'actions';
import {withCommas, toHP} from 'utils/format';
import WalletPage from 'components/WalletPage';

const Main = ({
  lockConnect,
  loadAccountConnect,
  loadPropertiesConnect,
  user,
  globalProperties,
  navigation,
  accounts,
}) => {
  useEffect(() => {
    if (accounts[0]) {
      console.log(accounts);
      loadAccountConnect(accounts[0].name);
    }
    loadPropertiesConnect();
  }, [loadAccountConnect, loadPropertiesConnect, accounts]);
  if (!user) {
    return null;
  }
  return (
    <WalletPage>
      <Text h3 style={styles.textCentered}>
        Main
      </Text>
      <Text style={styles.white}>{`${withCommas(
        user.account.balance,
      )} HIVE`}</Text>
      <Text style={styles.white}>{`${withCommas(
        user.account.sbd_balance,
      )} HBD`}</Text>
      <Text style={styles.white}>
        {globalProperties &&
          `${withCommas(
            toHP(user.account.vesting_shares, globalProperties),
          )} HP`}
      </Text>
      <Button
        title="Transfer"
        onPress={() => {
          navigation.navigate('TransferScreen', {initialCurrency: 'HBD'});
        }}
      />
      <Button title="Delegations" onPress={lockConnect} />
      <Button title="Witness" onPress={lockConnect} />
      <Button title="History" onPress={lockConnect} />
      <Button title="Lock" onPress={lockConnect} />
    </WalletPage>
  );
};

const styles = StyleSheet.create({
  textCentered: {textAlign: 'center'},
  white: {color: 'white'},
});

export default connect(
  (state) => {
    console.log(state);
    return {
      user: state.activeAccount,
      globalProperties: state.globalProperties,
      accounts: state.accounts,
    };
  },
  {
    lockConnect: lock,
    loadAccountConnect: loadAccount,
    loadPropertiesConnect: loadProperties,
  },
)(Main);
