import Separator from 'components/ui/Separator';
import React, {useContext} from 'react';
import {StyleSheet, Text, useWindowDimensions} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Height} from 'utils/common.types';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

export default () => {
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions(), theme);

  return (
    <>
      <Text style={styles.h4}>{translate('components.copy_keys.title')}</Text>
      <Separator />
      <Text style={styles.textContent}>
        {capitalizeSentence(translate('components.copy_keys.text1'))}
      </Text>
      <Separator height={20} />
      <Text style={styles.textContent}>
        <Text style={styles.textContent}>
          {capitalizeSentence(translate('components.copy_keys.text2'))}
        </Text>
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
