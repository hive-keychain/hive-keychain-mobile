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
      <Text style={styles.h4}>{translate('components.copy_keys.title')}</Text>
      <Separator />
      <Text style={styles.textContent}>
        {translate('components.copy_keys.text1')}
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
