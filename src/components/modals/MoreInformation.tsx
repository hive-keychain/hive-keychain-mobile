import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

export default () => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);

  return (
    <SafeArea skipTop>
      <Text style={styles.h4}>
        {translate('components.moreInformation.title')}
      </Text>
      <Separator />
      <Text style={styles.textContent}>
        {translate('components.moreInformation.text1')}
      </Text>
      <Separator height={10} />
      <Text style={styles.textContent}>
        <Text style={styles.textContent}>
          {translate('components.moreInformation.text2')}
        </Text>
        <Text style={[styles.textContent, styles.bold]}>
          {' '}
          {translate('components.moreInformation.text3')}
        </Text>
      </Text>
      <Separator height={10} />
      <Text style={styles.textContent}>
        {translate('components.moreInformation.text4')}
      </Text>
    </SafeArea>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    h4: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    textContent: {
      ...button_link_primary_small,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_small}.fontSize,
      ),
    },
    bold: {fontFamily: FontPoppinsName.BOLD},
  });
