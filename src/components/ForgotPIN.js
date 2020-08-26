import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {connect} from 'react-redux';

import {forgetAccounts} from 'actions';
import Separator from './Separator';
import IconSlider from './IconSlider';
import EllipticButton from './EllipticButton';
import {translate} from 'utils/localize';

const ForgotPIN = ({forgetAccountsConnect}) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});
  return (
    <IconSlider icon={<Text style={styles.header}>Forgot PIN?</Text>}>
      <Text style={styles.h4}>{translate('components.forgotPIN.title')}</Text>
      <Separator />
      <Text>{translate('components.forgotPIN.text')}</Text>
      <Separator height={height / 15} />
      <EllipticButton
        title={translate('components.forgotPIN.button')}
        onPress={forgetAccountsConnect}
      />
    </IconSlider>
  );
};
const getDimensionedStyles = ({width}) =>
  StyleSheet.create({
    header: {color: 'white', marginRight: width * 0.05, fontWeight: 'bold'},
    h4: {fontWeight: 'bold', fontSize: 18},
  });

export default connect(null, {forgetAccountsConnect: forgetAccounts})(
  ForgotPIN,
);
