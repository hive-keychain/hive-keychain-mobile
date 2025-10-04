import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Height} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

export default () => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  return (
    <>
      <Text style={styles.h4}>{translate('components.infoQR.title')}</Text>
      <Separator />
      <Text style={styles.textContent}>
        {translate('components.infoQR.text1')}
      </Text>
      <Separator height={10} />
      <Text style={styles.textContent}>
        <Text style={styles.textContent}>
          {translate('components.infoQR.text2')}
        </Text>
        <Text style={styles.textContent}>
          {' '}
          {translate('components.infoQR.text3')}
        </Text>
        {translate('components.infoQR.text4')}
        <Text style={styles.textContent}>
          {' '}
          {translate('components.infoQR.text5')}
        </Text>{' '}
        {translate('components.infoQR.text6')}{' '}
        <Text style={styles.textContent}>
          {translate('components.infoQR.text7')}
        </Text>
        .
      </Text>
    </>
  );
};

const getDimensionedStyles = ({height}: Height, theme: Theme) =>
  StyleSheet.create({
    h4: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
    },
    textContent: {
      ...button_link_primary_small,
      color: getColors(theme).secondaryText,
    },
    bold: {fontFamily: FontPoppinsName.BOLD},
  });
