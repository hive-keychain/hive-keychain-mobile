import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Background from 'components/ui/Background';
import {SafeAreaView} from 'react-native-safe-area-context';
import Separator from 'components/ui/Separator';
import UserPicker from 'components/form/UserPicker';
import EllipticButton from 'components/form/EllipticButton';
import {forgetKey, addKey, forgetAccount} from 'actions';

const AccountManagement = ({
  account,
  forgetKeyConnect,
  forgetAccountConnect,
  addKeyConnect,
}) => {
  const {
    posting,
    postingPubkey,
    active,
    activePubkey,
    memo,
    memoPubkey,
  } = account.keys;
  return (
    <SafeAreaView>
      <Background>
        <Separator height={50} />
        <UserPicker username={account.name} accounts={[account]} />
        <View
          style={{color: 'white', display: 'flex', flexDirection: 'column'}}>
          <Text style={styles.keyAuthority}>Posting Key</Text>
          <Text style={styles.keyType}>Private:</Text>
          <Text style={styles.privateKey}>{posting}</Text>
          <Text style={styles.keyType}>Public:</Text>
          <Text style={styles.publicKey}>{postingPubkey}</Text>
          <Text style={styles.keyAuthority}>Active Key</Text>
          <Text style={styles.keyType}>Private:</Text>
          <Text style={styles.privateKey}>{active}</Text>
          <Text style={styles.keyType}>Public:</Text>
          <Text style={styles.publicKey}>{activePubkey}</Text>
          <Text style={styles.keyAuthority}>Memo Key</Text>
          <Text style={styles.keyType}>Private:</Text>
          <Text style={styles.privateKey}>{memo}</Text>
          <Text style={styles.keyType}>Public:</Text>
          <Text style={styles.publicKey}>{memoPubkey}</Text>
        </View>
        <Separator height={50} />
        <EllipticButton
          title="FORGET ACCOUNT"
          onPress={() => {
            forgetAccountConnect(account.name);
          }}
        />
      </Background>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyAuthority: {color: 'white'},
  keyType: {color: 'white'},
  privateKey: {color: 'white'},
  publicKey: {color: 'white'},
});

const mapStateToProps = (state) => ({account: state.activeAccount});

export default connect(mapStateToProps, {
  forgetAccountConnect: forgetAccount,
  addKeyConnect: addKey,
  forgetKeyConnect: forgetKey,
})(AccountManagement);
