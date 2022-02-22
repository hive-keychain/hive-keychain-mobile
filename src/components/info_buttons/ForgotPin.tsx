import ForgotPIN from 'components/modals/ForgotPIN';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Width} from 'utils/common.types';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export default () => {
  const styles = getDimensionedStyles(useWindowDimensions());
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {modalContent: <ForgotPIN />});
      }}>
      <Text style={styles.text}>{translate('components.forgotPIN.title')}</Text>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    text: {
      color: 'white',
      marginRight: width * 0.05,
      fontWeight: 'bold',
    },
  });
