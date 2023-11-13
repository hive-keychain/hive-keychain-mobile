import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {translate} from 'utils/localize';
import Separator from './Separator';

interface Props {
  theme: Theme;
  titleKey: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  additionalConfirmTextStyle?: StyleProp<TextStyle>;
}

const ConfirmationInItem = ({
  theme,
  titleKey,
  onConfirm,
  onCancel,
  isLoading,
  additionalConfirmTextStyle,
}: Props) => {
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Separator height={10} />
      <Text style={[styles.textBase, styles.opaque, styles.textCentered]}>
        {translate(titleKey)}
      </Text>
      <Separator height={10} />
      <View style={styles.flexRow}>
        <EllipticButton
          title={translate('common.cancel')}
          onPress={onCancel}
          style={[getButtonStyle(theme).secondaryButton, styles.button]}
          additionalTextStyle={styles.textBase}
        />
        <ActiveOperationButton
          title={translate('common.confirm')}
          onPress={onConfirm}
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
          additionalTextStyle={[styles.textBase, additionalConfirmTextStyle]}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '80%',
      alignItems: 'center',
      alignSelf: 'center',
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    button: {
      width: '48%',
      marginHorizontal: 0,
      height: 40,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    opaque: {
      opacity: 0.7,
    },
    textCentered: {
      textAlign: 'center',
    },
  });

export default ConfirmationInItem;
