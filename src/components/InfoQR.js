import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import Information from 'assets/addAccount/icon_info.svg';
import Separator from './Separator';
import IconSlider from './IconSlider';
import {translate} from 'utils/localize';

export default () => {
  const styles = getDimensionedStyles(useWindowDimensions());

  return (
    <IconSlider icon={<Information style={styles.info} />}>
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
    </IconSlider>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    h4: {fontWeight: 'bold', fontSize: 18},
    bold: {fontWeight: 'bold'},
    modal: {height: height * 0.45, marginTop: height * 0.45},
    info: {marginRight: width * 0.05},
  });
