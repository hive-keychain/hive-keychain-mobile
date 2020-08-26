import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import Background from 'components/Background';
import GradientEllipse from 'components/GradientEllipse';
import KeychainLogo from 'assets/kc_hive.svg';
import Separator from 'components/Separator';
import EllipticButton from 'components/EllipticButton';
import {translate} from 'utils/localize';

const Introduction = ({navigation}) => {
  const {height, width} = useWindowDimensions();
  const styles = getDimensionedStyles({height, width});
  return (
    <Background>
      <Separator height={height / 15} />
      <KeychainLogo {...styles.image} />
      <Separator height={height / 20} />
      <GradientEllipse style={styles.gradient} dotColor="red">
        <Text style={styles.text}>{translate('intro.text')}</Text>
      </GradientEllipse>
      <GradientEllipse style={styles.gradient} dotColor="white">
        <Text style={styles.text}>{translate('intro.manage')}</Text>
      </GradientEllipse>
      <Separator height={height / 7.5} />
      <EllipticButton
        title={translate('intro.existingAccount')}
        onPress={() => {
          navigation.navigate('SignupScreen');
        }}
      />
      <Separator height={height / 20} />
      <EllipticButton
        title={translate('intro.createAccount')}
        onPress={() => {
          navigation.navigate('CreateAccountScreen');
        }}
      />
    </Background>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    image: {width: '90%', paddingHorizontal: width * 0.05},
    gradient: {height: height / 10, marginTop: height / 20},
    text: {
      color: 'white',
      marginHorizontal: width * 0.05,
      fontSize: 15,
      textAlign: 'justify',
    },
  });

export default Introduction;
