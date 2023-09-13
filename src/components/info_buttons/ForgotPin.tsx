import ForgotPIN from 'components/modals/ForgotPIN';
import React, {useContext} from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export default () => {
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {modalContent: <ForgotPIN />});
      }}>
      <Text style={styles.text}>{translate('components.forgotPIN.title')}</Text>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    text: {
      color: getColors(theme).secondaryText,
      marginRight: width * 0.05,
      fontWeight: '600',
    },
  });
