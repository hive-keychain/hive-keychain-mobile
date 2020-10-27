import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {connect} from 'react-redux';
import Background from 'components/ui/Background';
import {SafeAreaView} from 'react-native-safe-area-context';
import Separator from 'components/ui/Separator';
import UserPicker from 'components/form/UserPicker';
import EllipticButton from 'components/form/EllipticButton';
import {forgetKey, addKey, forgetAccount} from 'actions';
import Toast from 'react-native-simple-toast';
import {translate} from 'utils/localize';

const AccountManagement = ({
  account,
  forgetKeyConnect,
  forgetAccountConnect,
  addKeyConnect,
}) => {
  return (
    <SafeAreaView>
      <Background>
        <Separator height={50} />
        <UserPicker username={account.name} accounts={[account]} />
        <View
          style={{color: 'white', display: 'flex', flexDirection: 'column'}}>
          <Key
            type="posting"
            account={account}
            forgetKeyConnect={forgetKeyConnect}
            addKeyConnect={addKeyConnect}
          />
          <Key
            type="active"
            account={account}
            forgetKeyConnect={forgetKeyConnect}
            addKeyConnect={addKeyConnect}
          />
          <Key
            type="memo"
            account={account}
            forgetKeyConnect={forgetKeyConnect}
            addKeyConnect={addKeyConnect}
          />
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

const Key = ({type, account, forgetKeyConnect, addKeyConnect}) => {
  const privateKey = account.keys[type];
  const publicKey = account.keys[`${type}Pubkey`];
  const [key, setKey] = useState('');
  return (
    <>
      <Text style={styles.keyAuthority}>{type} Key</Text>
      {privateKey ? (
        <>
          <Button
            title="X"
            onPress={() => {
              forgetKeyConnect(account.name, type);
            }}
          />
          <Text style={styles.keyType}>Private:</Text>
          <TouchableOpacity
            onLongPress={() => {
              Clipboard.setString(privateKey);
              Toast.show(translate('toast.keys.copied'));
            }}>
            <Text style={styles.privateKey}>{privateKey}</Text>
          </TouchableOpacity>
          <Text style={styles.keyType}>Public:</Text>
          <TouchableOpacity
            onLongPress={() => {
              Clipboard.setString(publicKey);
              Toast.show(translate('toast.keys.copied'));
            }}>
            <Text style={styles.publicKey}>{publicKey}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput value={key} onChangeText={setKey} />
          <Button
            title="V"
            onPress={() => {
              addKeyConnect(account.name, type, key);
            }}
          />
        </>
      )}
    </>
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
