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
import {getVP, getRC, getVotingDollarsPerAccount} from 'utils/hiveUtils';

const Main = ({
  lockConnect,
  loadAccountConnect,
  loadPropertiesConnect,
  user,
  properties,
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
          percent={user.rc.percentage / 100 || 100}
          color="#E59D15"
        />
        <PercentageDisplay
          name={translate('wallet.vp')}
          percent={getVP(user.account) || 100}
          color="#3BB26E"
          secondary={`$${
            getVotingDollarsPerAccount(100, properties, user.account, false) ||
            '0'
          }`}
        />
      </View>

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
      properties: state.properties,
      accounts: state.accounts,
    };
  },
  {
    lockConnect: lock,
    loadAccountConnect: loadAccount,
    loadPropertiesConnect: loadProperties,
  },
)(Main);
