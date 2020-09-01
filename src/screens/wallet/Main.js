import React, {useEffect} from 'react';
import {StyleSheet, Button, View, useWindowDimensions} from 'react-native';

import {Text} from 'react-native-elements';
import {connect} from 'react-redux';

import {lock, loadAccount, loadProperties} from 'actions';
import {withCommas, toHP} from 'utils/format';
import WalletPage from 'components/WalletPage';
import UserPicker from 'components/UserPicker';
import PercentageDisplay from 'components/PercentageDisplay';
import {translate} from 'utils/localize';

const Main = ({
  lockConnect,
  loadAccountConnect,
  loadPropertiesConnect,
  user,
  globalProperties,
  navigation,
  accounts,
}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

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
      <UserPicker
        accounts={accounts.map((account) => account.name)}
        activeAccount={user.account}
        onAccountSelected={loadAccountConnect}
      />
      <View style={styles.resourcesWrapper}>
        <PercentageDisplay
          name={translate('wallet.rc')}
          percent={53}
          color="#E59D15"
        />
        <PercentageDisplay
          name={translate('wallet.vp')}
          percent={87}
          color="#3BB26E"
          secondary="$127.54"
        />
      </View>
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

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    textCentered: {textAlign: 'center'},
    white: {color: 'white'},
    resourcesWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: width * 0.05,
      marginRight: width * 0.05,
    },
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
