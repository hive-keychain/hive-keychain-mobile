import EllipticButton from 'components/form/EllipticButton';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import RequestMessage from './RequestMessage';

type Props = {closeGracefully: () => void; resultMessage: string};
export default ({closeGracefully, resultMessage}: Props) => {
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
