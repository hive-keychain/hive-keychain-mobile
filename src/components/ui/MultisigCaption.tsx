import LOGO_MULTISIG from 'assets/wallet/multisig.png';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Caption} from './Caption';
const MultisigCaption = () => {
  return (
    <View style={styles.container}>
      <Image source={LOGO_MULTISIG} style={styles.image} />
      <Caption text={'multisig.disclaimer_message'} hideSeparator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    width: '80%',
  },
  image: {width: 50, height: 30, marginTop: 10},
});

export default MultisigCaption;
