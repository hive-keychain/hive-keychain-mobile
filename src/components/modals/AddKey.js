import React, {useState} from 'react';
import {StyleSheet, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';

import Operation from 'components/operations/Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';

import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import {goBack} from 'utils/navigation';
import {addKey} from 'actions';

const Transfer = ({addKeyConnect, name, type}) => {
  console.log(name, type);
  const {key, setKey} = useState('');
  return (
    <Operation title={translate('setting.keys.add')}>
      <Separator />
      <OperationInput
        placeholder={translate('common.key').toUpperCase()}
        leftIcon={<AccountLogoDark />}
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
