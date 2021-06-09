import React, {useEffect} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';

import {connect} from 'react-redux';
import {
  lock,
  loadAccount,
  loadProperties,
  loadBittrex,
  fetchPhishingAccounts,
} from 'actions';
import WalletPage from 'components/ui/WalletPage';
import UserPicker from 'components/form/UserPicker';
import PercentageDisplay from 'components/hive/PercentageDisplay';
import {translate} from 'utils/localize';
import {getVP, getVotingDollarsPerAccount} from 'utils/hiveUtils';
import ScreenToggle from 'components/ui/ScreenToggle';
import Primary from 'screens/wallet/Primary';
import Tokens from 'screens/wallet/Tokens';

const Main = ({
  lock,
  loadAccount,
  loadProperties,
  loadBittrex,
  fetchPhishingAccounts,
  user,
  properties,
  navigation,
  accounts,
  lastAccount,
}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  useEffect(() => {
    loadAccount(lastAccount || accounts[0].name);
    loadProperties();
    loadBittrex();
    fetchPhishingAccounts();
  }, [
    loadAccount,
    accounts,
    loadProperties,
    loadBittrex,
    fetchPhishingAccounts,
    lastAccount,
  ]);

  if (!user) {
    return null;
  }
  console.log(user);
  return (
    <WalletPage>
      <UserPicker
        accounts={accounts.map((account) => account.name)}
        username={user.name}
        addAccount={() => {
          navigation.navigate('AddAccountFromWalletScreen', {wallet: true});
        }}
        onAccountSelected={loadAccount}
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
        style={styles.toggle}
        menu={['Primary', 'Tokens']}
        toUpperCase
        components={[<Primary navigation={navigation} />, <Tokens />]}
      />
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
    toggle: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
    },
  });

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
      properties: state.properties,
      accounts: state.accounts,
      lastAccount: state.lastAccount.name,
    };
  },
  {
    lock,
    loadAccount,
    loadProperties,
    loadBittrex,
    fetchPhishingAccounts,
  },
)(Main);
