import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {navigate} from 'navigationRef';
import ForgotPIN from 'components/ForgotPIN';

export default () => {
  const {height, width} = useWindowDimensions();
  const styles = getDimensionedStyles({height, width});
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {modalContent: <ForgotPIN />});
      }}>
      <Text style={styles.text}>Forgot PIN?</Text>
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
