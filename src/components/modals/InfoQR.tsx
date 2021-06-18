import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Height} from 'utils/common.types';
import {translate} from 'utils/localize';

export default () => {
  const styles = getDimensionedStyles(useWindowDimensions());
  return (
    <>
      <Text style={styles.h4}>{translate('components.infoQR.title')}</Text>
      <Separator />
      <Text>{translate('components.infoQR.text1')}</Text>
      <Separator height={10} />
      <Text>
        <Text>{translate('components.infoQR.text2')}</Text>
        <Text style={styles.bold}> {translate('components.infoQR.text3')}</Text>
        {translate('components.infoQR.text4')}
        <Text style={styles.bold}>
          {' '}
          {translate('components.infoQR.text5')}
        </Text>{' '}
        {translate('components.infoQR.text6')}{' '}
        <Text style={styles.bold}>{translate('components.infoQR.text7')}</Text>.
      </Text>
    </>
  );
};

const getDimensionedStyles = ({height}: Height) =>
  StyleSheet.create({
    h4: {fontWeight: 'bold', fontSize: 18},
    bold: {fontWeight: 'bold'},
    modal: {height: height * 0.45, marginTop: height * 0.45},
  });
