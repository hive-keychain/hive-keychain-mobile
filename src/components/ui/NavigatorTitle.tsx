import React from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

type Props = {
  title: string;
  skipTranslation?: boolean;
};

export default ({title, skipTranslation}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  return (
    <Text style={styles.title}>
      {skipTranslation ? title : translate(title)}
    </Text>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    title: {
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...headlines_primary_headline_2}.fontSize,
      ),
      includeFontPadding: false,
      textAlignVertical: 'center',
      textAlign: 'center',
    },
  });
