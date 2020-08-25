import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Background from 'components/Background';
import GradientEllipse from 'components/GradientEllipse';
import KeychainLogo from 'assets/kc_hive.svg';
import Separator from 'components/Separator';
import EllipticButton from 'components/EllipticButton';
import {translate} from 'utils/localize';

const Introduction = ({navigation}) => {
  return (
    <Background>
      <Separator height={50} />
      <KeychainLogo {...styles.image} />
      <Separator height={30} />
      <GradientEllipse style={styles.gradient} dotColor="red">
        <Text style={styles.text}>{translate('intro.text')}</Text>
      </GradientEllipse>
      <GradientEllipse style={styles.gradient} dotColor="white">
        <Text style={styles.text}>{translate('intro.text')}</Text>
      </GradientEllipse>
      <Separator height={100} />
      <EllipticButton
        title={translate('intro.existingAccount')}
        onPress={() => {
          navigation.navigate('SignupScreen');
        }}
      />
      <Separator height={30} />
      <EllipticButton
        title={translate('intro.createAccount')}
        onPress={() => {
          navigation.navigate('CreateAccountScreen');
        }}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  image: {width: '90%'},
  gradient: {height: 100, marginTop: 30},
  text: {color: 'white', marginLeft: 25, fontSize: 16},
});

export default Introduction;
