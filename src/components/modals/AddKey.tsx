import {addKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
  headlines_primary_headline_1,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';

type Props = PropsFromRedux & {name: string; type: KeyTypes; theme: Theme};

const AddKey = ({addKey, name, type, theme}: Props) => {
  const [key, setKey] = useState('');
  const styles = getStyles(theme);
  return (
    <>
      <Separator height={30} />
      <Text style={styles.title}>
        {translate('settings.keys.add_keyType', {type})}
      </Text>
      <Separator />
      <OperationInput
        labelInput={translate('common.privateKey')}
        placeholder={translate('common.privateKey')}
        autoCapitalize="none"
        value={key}
        onChangeText={setKey}
      />

      <Separator height={50} />
      <EllipticButton
        title={translate('common.save')}
        onPress={() => {
          addKey(name, type, key);
          Keyboard.dismiss();
          goBack();
        }}
        style={getButtonStyle(theme).warningStyleButton}
        additionalTextStyle={{...button_link_primary_medium}}
      />
    </>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    text: {color: getColors(theme).secondaryText, ...body_primary_body_1},
    title: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_1,
      fontSize: 18,
      textAlign: 'center',
    },
    smallerText: {
      fontSize: 13,
    },
  });

const connector = connect(null, {addKey});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AddKey);
