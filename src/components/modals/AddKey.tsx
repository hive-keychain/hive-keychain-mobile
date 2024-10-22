import {addKey} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import React, {useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
  headlines_primary_headline_1,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';

type Props = PropsFromRedux & {name: string; type: KeyTypes};

const AddKey = ({addKey, name, type}: Props) => {
  const [key, setKey] = useState('');
  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  return (
    <View
      style={{justifyContent: 'space-between', flex: 1, paddingVertical: 24}}>
      <Text style={styles.title}>
        {translate('settings.keys.add_keyType', {type})}
      </Text>
      <OperationInput
        labelInput={translate('common.privateKey')}
        placeholder={translate('common.privateKey')}
        autoCapitalize="none"
        value={key}
        onChangeText={setKey}
      />
      <EllipticButton
        title={translate('common.save')}
        onPress={() => {
          addKey(name, type, key.trim());
          Keyboard.dismiss();
          goBack();
        }}
        style={getButtonStyle(theme, width).warningStyleButton}
        isWarningButton
        additionalTextStyle={{...button_link_primary_medium}}
      />
    </View>
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
