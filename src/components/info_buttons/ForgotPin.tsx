import ForgotPIN from 'components/modals/ForgotPIN';
import {ModalScreenProps} from 'navigators/Root.types';
import React from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {FontPoppinsName, underlined} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export default () => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {
          name: '',
          modalContent: <ForgotPIN theme={theme} />,
          modalContainerStyle: getModalBaseStyle(theme).roundedTop,
          fixedHeight: 0.4,
        } as ModalScreenProps);
      }}>
      <Text style={styles.text}>{translate('components.forgotPIN.title')}</Text>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    text: {
      color: getColors(theme).secondaryText,
      fontFamily: FontPoppinsName.SEMI_BOLD,
      ...underlined,
    },
  });
