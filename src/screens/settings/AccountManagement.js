import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import {connect} from 'react-redux';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import UserPicker from 'components/form/UserPicker';
import EllipticButton from 'components/form/EllipticButton';
import {forgetKey, addKey, forgetAccount} from 'actions';
import Key from 'components/hive/Key';
import HeaderDrawer from 'components/ui/HeaderDrawerScreens';

const AccountManagement = ({
  account,
  forgetKeyConnect,
  forgetAccountConnect,
  addKeyConnect,
  navigation,
  accounts,
}) => {
  const [username, setUsername] = useState(account.name);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setUsername(account.name);
    });
    return unsubscribe;
  }, [navigation, account.name]);
  return (
    <SafeArea style={{backgroundColor: 'white'}}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />

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
          navigation={navigation}
        />
        <Key
          type="active"
          containerStyle={styles.keyEven}
          account={accounts.find((e) => e.name === username)}
          forgetKey={forgetKeyConnect}
          addKey={addKeyConnect}
          navigation={navigation}
        />
        <Key
          type="memo"
          containerStyle={styles.keyOdd}
          account={accounts.find((e) => e.name === username)}
          forgetKey={forgetKeyConnect}
          addKey={addKeyConnect}
          navigation={navigation}
        />
        <Separator height={20} />
        <EllipticButton
          style={styles.button}
          title="FORGET ACCOUNT"
          onPress={() => {
            forgetAccountConnect(username);
          }}
        />
        <Separator height={50} />
      </ScrollView>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
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
