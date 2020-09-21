import React, {useEffect} from 'react';
import {StyleSheet, Button, View, useWindowDimensions} from 'react-native';

import {connect} from 'react-redux';
import {lock, loadAccount, loadProperties, loadBittrex} from 'actions';
import WalletPage from 'components/WalletPage';
import UserPicker from 'components/UserPicker';
import PercentageDisplay from 'components/PercentageDisplay';
import {translate} from 'utils/localize';
import {getVP, getVotingDollarsPerAccount} from 'utils/hiveUtils';
import ScreenToggle from 'components/ScreenToggle';
import Primary from 'screens/wallet/Primary';
import Tokens from 'screens/wallet/Tokens';

const Main = ({
  lockConnect,
  loadAccountConnect,
  loadPropertiesConnect,
  loadBittrexConnect,
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
    loadBittrexConnect();
  }, [loadAccountConnect, loadPropertiesConnect, loadBittrexConnect, accounts]);

  if (!user) {
    return null;
  }

  return (
    <WalletPage>
      <UserPicker
        accounts={accounts.map((account) => account.name)}
        activeAccount={user.account}
        addAccount={() => {
          navigation.navigate('AddAccountFromWalletScreen', {wallet: true});
        }}
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
      <ScreenToggle
        style={styles.resourcesWrapper}
        menu={['Primary', 'Tokens']}
        toUpperCase
        components={[<Primary />, <Tokens />]}
      />

      <Button
        title="Transfer"
        onPress={() => {
          navigation.navigate('TransferScreen', {initialCurrency: 'HBD'});
        }}
      />
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
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
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
    loadBittrexConnect: loadBittrex,
  },
)(Main);
