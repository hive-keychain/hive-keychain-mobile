import React, {useState} from 'react';
import {StyleSheet, Keyboard, View} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Operation from 'components/operations/Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';

import KeyIcon from 'assets/addAccount/icon_key.svg';
import Keychain from 'assets/keychain.svg';
import {goBack} from 'utils/navigation';
import {addKey} from 'actions';

const Transfer = ({addKeyConnect, name, type}) => {
  console.log(name, type);
  const {key, setKey} = useState('');
  return (
    <Operation
      title={translate('settings.keys.add')}
      logo={
        <View
          style={{
            backgroundColor: 'black',
            width: 40,
            height: 40,
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Keychain height={25} />
        </View>
      }>
      <Separator />
      <OperationInput
        placeholder={translate('common.privateKey').toUpperCase()}
        leftIcon={<KeyIcon />}
        autoCapitalize="none"
        value={key}
        onChangeText={setKey}
      />

      <Separator height={40} />
      <EllipticButton
        title={translate('common.send')}
        onPress={() => {
          addKeyConnect(name, type, key);
        }}
        style={styles.button}
      />
    </Operation>
  );
};

const styles = StyleSheet.create({
  button: {backgroundColor: '#68A0B4'},
  currency: {fontWeight: 'bold', fontSize: 18},
});

export default connect(null, {addKeyConnect: addKey})(Transfer);
