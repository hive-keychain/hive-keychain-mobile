import EllipticButton from 'components/form/EllipticButton';
import TwoFaForm from 'components/form/TwoFaForm';
import React, {useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  headlines_primary_headline_1,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation.utils';

type Props = {
  twoFABots: {[botName: string]: string};
  onSubmit: (options: TransactionOptions) => void;
};
const TwoFaModal = ({twoFABots, onSubmit}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme);
  const [twoFAcodes, setTwoFACodes] = useState<{[botName: string]: string}>(
    twoFABots,
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translate('multisig.enter_otp')}</Text>
      <TwoFaForm twoFABots={twoFAcodes} setTwoFABots={setTwoFACodes} />
      <EllipticButton
        title={translate('common.confirm')}
        onPress={() => {
          onSubmit({
            multisig: true,
            metaData: {twoFACodes: twoFAcodes},
            fromWallet: true,
          });
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
    container: {justifyContent: 'space-between', flex: 1, padding: 24},
    title: {
      color: getColors(theme).primaryText,
      ...headlines_primary_headline_1,
      fontSize: 18,
      textAlign: 'center',
    },
  });

export default TwoFaModal;
