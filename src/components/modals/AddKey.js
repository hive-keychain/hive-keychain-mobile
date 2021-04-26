import React, {useState} from 'react';
import {StyleSheet, Keyboard} from 'react-native';
import {connect} from 'react-redux';

import Operation from 'components/operations/Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';

import KeyIcon from 'assets/addAccount/icon_key.svg';
import KeychainLogo from 'components/ui/KeychainLogo';
import {goBack} from 'utils/navigation';
import {addKey} from 'actions';

const AddKey = ({addKey, name, type}) => {
  console.log(name, type);
  const [key, setKey] = useState('');
  return (
    <Operation
      title={translate('settings.keys.add')}
      logo={<KeychainLogo width={40} />}>
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
        title={translate('common.save')}
        onPress={() => {
          console.log('key', key);
          addKey(name, type, key);
          Keyboard.dismiss();
          goBack();
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

export default connect(null, {addKey})(AddKey);
