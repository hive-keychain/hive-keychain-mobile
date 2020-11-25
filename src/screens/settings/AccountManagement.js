import React, {useState} from 'react';
import {View, StyleSheet, StatusBar, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import Separator from 'components/ui/Separator';
import UserPicker from 'components/form/UserPicker';
import EllipticButton from 'components/form/EllipticButton';
import {forgetKey, addKey, forgetAccount} from 'actions';
import Key from 'components/hive/Key';
import Menu from 'assets/wallet/menu.svg';

const AccountManagement = ({
  account,
  forgetKeyConnect,
  forgetAccountConnect,
  addKeyConnect,
  navigation,
  accounts,
}) => {
  const [username, setUsername] = useState(account.name);
  return (
    <SafeAreaView backgroundColor="white">
      <StatusBar backgroundColor="black" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>WALLET KEYS</Text>
        <Menu
          width={25}
          height={25}
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      </View>

      <ScrollView style={styles.scrollview}>
        <UserPicker
          username={username}
          accounts={accounts.map((acc) => acc.name)}
          onAccountSelected={(name) => {
            setUsername(name);
          }}
        />
        <Text style={styles.disclaimer}>
          To receive funds, simply share your account name (displayed above)
          with the sender.
        </Text>
        <Text style={styles.disclaimer}>
          However, many applications will require a PRIVATE KEY to prove
          ownership or to conduct transactions on your behalf.{' '}
          <Text style={styles.important}>
            ONLY SHARE PRIVATE KEYS WITH PARTIES THAT YOU TRUST!
          </Text>
        </Text>
        <Text style={styles.disclaimer}>
          In the future, Hive Keychain for mobile will enable App to App
          transactions, removing the need to use your private keys directly in
          third-party Apps.
        </Text>
        <Separator height={20} />
        <Key
          type="posting"
          containerStyle={styles.keyOdd}
          account={accounts.find((e) => e.name === username)}
          forgetKey={forgetKeyConnect}
          addKey={addKeyConnect}
        />
        <Key
          type="active"
          containerStyle={styles.keyEven}
          account={accounts.find((e) => e.name === username)}
          forgetKey={forgetKeyConnect}
          addKey={addKeyConnect}
        />
        <Key
          type="memo"
          containerStyle={styles.keyOdd}
          account={accounts.find((e) => e.name === username)}
          forgetKey={forgetKeyConnect}
          addKey={addKeyConnect}
        />
        <Separator height={20} />
        <EllipticButton
          style={styles.button}
          title="FORGET ACCOUNT"
          onPress={() => {
            forgetAccountConnect(account.name);
          }}
        />
        <Separator height={50} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'black',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {color: '#B9C9D6', fontSize: 18},
  disclaimer: {color: '#404950', marginVertical: 2, paddingHorizontal: 20},
  important: {color: '#A3112A', fontWeight: 'bold'},
  button: {backgroundColor: '#B9122F'},
  keyOdd: {backgroundColor: '#E5EEF7', padding: 20},
  keyEven: {backgroundColor: '#FFFFFF', padding: 20},
  scrollview: {},
});

const mapStateToProps = (state) => ({
  account: state.activeAccount,
  accounts: state.accounts,
});

export default connect(mapStateToProps, {
  forgetAccountConnect: forgetAccount,
  addKeyConnect: addKey,
  forgetKeyConnect: forgetKey,
})(AccountManagement);
