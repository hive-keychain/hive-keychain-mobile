import KeychainLogo from 'assets/kc_hive.svg';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import GradientEllipse from 'components/ui/GradientEllipse';
import Separator from 'components/ui/Separator';
import React from 'react';
import {Linking, StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Dimensions} from 'types/common';
import {IntroductionNavProp} from 'types/stacks';
import {hiveConfig} from 'utils/config';
import {translate} from 'utils/localize';

const Introduction = ({navigation}: IntroductionNavProp) => {
  const {height, width} = useWindowDimensions();
  const styles = getDimensionedStyles({height, width});
  return (
    <Background>
      <>
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
            Linking.canOpenURL(hiveConfig.CREATE_ACCOUNT_URL).then(
              (supported) => {
                if (supported) {
                  Linking.openURL(hiveConfig.CREATE_ACCOUNT_URL);
                }
              },
            );
          }}
        />
      </>
    </Background>
  );
};
const getDimensionedStyles = ({width, height}: Dimensions) =>
  StyleSheet.create({
    image: {width: '90%', paddingHorizontal: width * 0.05},
    gradient: {height: height / 10, marginTop: height / 20},
    text: {
      color: 'white',
      marginHorizontal: width * 0.05,
      fontSize: 15,
      textAlign: 'justify',
      flex: 1,
    },
  });

export default Introduction;
