import {addKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import KeyIcon from 'assets/addAccount/icon_key.svg';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Operation from 'components/operations/Operation';
import KeychainLogo from 'components/ui/KeychainLogo';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';

type Props = PropsFromRedux & {name: string; type: KeyTypes};

const AddKey = ({addKey, name, type}: Props) => {
  const [key, setKey] = useState('');
  return (
    <Operation
      title={translate('settings.keys.add')}
      logo={<KeychainLogo width={40} />}>
      <>
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
            addKey(name, type, key);
            Keyboard.dismiss();
            goBack();
          }}
          style={styles.button}
        />
      </>
    </Operation>
  );
};

const styles = StyleSheet.create({
  button: {backgroundColor: '#68A0B4'},
  currency: {fontWeight: 'bold', fontSize: 18},
});

const connector = connect(null, {addKey});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AddKey);
