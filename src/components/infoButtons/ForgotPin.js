import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {navigate} from 'utils/navigation';
import {translate} from 'utils/localize';
import ForgotPIN from 'components/modals/ForgotPIN';

export default () => {
  const {height, width} = useWindowDimensions();
  const styles = getDimensionedStyles({height, width});
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {modalContent: <ForgotPIN />});
      }}>
      <Text style={styles.text}>{translate('components.forgotPIN.title')}</Text>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    text: {
      color: 'white',
      marginRight: width * 0.05,
      fontWeight: 'bold',
    },
  });
