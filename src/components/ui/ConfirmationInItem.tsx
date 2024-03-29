import {KeyTypes} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {translate} from 'utils/localize';
import Loader from './Loader';
import Separator from './Separator';

interface Props {
  theme: Theme;
  titleKey?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  additionalConfirmTextStyle?: StyleProp<TextStyle>;
  keyType?: KeyTypes;
}

const ConfirmationInItem = ({
  theme,
  titleKey,
  onConfirm,
  onCancel,
  isLoading,
  additionalConfirmTextStyle,
  keyType = KeyTypes.active,
}: Props) => {
  const {width} = useWindowDimensions();
  const styles = getStyles(theme);
  return (
    <View style={[styles.container]}>
      {titleKey && (
        <>
          <Separator height={10} />
          <Text style={[styles.textBase, styles.opaque, styles.textCentered]}>
            {translate(titleKey)}
          </Text>
          <Separator height={10} />
        </>
      )}
      <View style={[styles.flexRow]}>
        {!isLoading && (
          <>
            <EllipticButton
              title={translate('common.cancel')}
              onPress={onCancel}
              style={[
                getButtonStyle(theme, width).secondaryButton,
                styles.button,
                styles.cancelButton,
              ]}
              // additionalTextStyle={styles.textBase}
            />
            <ActiveOperationButton
              title={translate('common.confirm')}
              onPress={onConfirm}
              style={[
                getButtonStyle(theme, width).warningStyleButton,
                styles.button,
              ]}
              additionalTextStyle={[additionalConfirmTextStyle]}
              isLoading={isLoading}
              method={keyType}
            />
          </>
        )}

        {isLoading && (
          <View style={[styles.loaderContainer]}>
            <Loader size={'small'} animating />
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      alignSelf: 'center',
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    loaderContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    button: {
      width: '48%',
      marginHorizontal: 0,
      height: 40,
    },
    cancelButton: {borderColor: getColors(theme).quaternaryCardBorderColor},
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
