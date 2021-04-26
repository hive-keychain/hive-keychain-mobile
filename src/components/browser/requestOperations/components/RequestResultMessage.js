import React from 'react';
import {View, StyleSheet} from 'react-native';
import RequestMessage from './RequestMessage';
import EllipticButton from 'components/form/EllipticButton';

export default ({closeGracefully, resultMessage}) => {
  return (
    <View style={styles.msgContainer}>
      <RequestMessage message={resultMessage} />
      <EllipticButton
        style={styles.buttonConfirm}
        title="OK"
        onPress={async () => {
          closeGracefully();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonConfirm: {position: 'absolute', bottom: 50},
  msgContainer: {height: '100%'},
});
