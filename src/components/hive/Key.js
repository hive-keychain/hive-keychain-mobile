import React, {useState} from 'react';
import {
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import {translate} from 'utils/localize';

export default ({type, account, forgetKey, addKey, containerStyle}) => {
  const privateKey = account.keys[type];
  const publicKey = account.keys[`${type}Pubkey`];
  const [key, setKey] = useState('');
  return (
    <View style={containerStyle}>
      <Text style={styles.keyAuthority}>{type.toUpperCase()} KEY</Text>
      {privateKey ? (
        <>
          <Button
            title="X"
            onPress={() => {
              forgetKey(account.name, type);
            }}
          />
          <Text style={styles.keyType}>Private:</Text>
          <TouchableOpacity
            onLongPress={() => {
              Clipboard.setString(privateKey);
              Toast.show(translate('toast.keys.copied'));
            }}>
            <Text style={styles.key}>{privateKey}</Text>
          </TouchableOpacity>
          <Text style={styles.keyType}>Public:</Text>
          <TouchableOpacity
            onLongPress={() => {
              Clipboard.setString(publicKey);
              Toast.show(translate('toast.keys.copied'));
            }}>
            <Text style={styles.key}>{publicKey}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput value={key} onChangeText={setKey} />
          <Button
            title="V"
            onPress={() => {
              addKey(account.name, type, key);
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  keyAuthority: {color: '#7E8C9A', fontSize: 20},
  keyType: {color: '#404950'},
  key: {color: '#404950', fontSize: 10},
});
