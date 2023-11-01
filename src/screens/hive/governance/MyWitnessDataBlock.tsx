import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  labelTranslationKey: string;
  value: string;
  theme: Theme;
  bottomValue?: string;
}

const MyWitnessDataBlock = ({
  labelTranslationKey,
  value,
  bottomValue,
  theme,
}: Props) => {
  const styles = getStyles(theme);
  return (
    <View style={[getCardStyle(theme).defaultCardItem, styles.container]}>
      <Text style={[styles.textBase, styles.textBold]}>
        {translate(labelTranslationKey)}
      </Text>
      <Text style={[styles.textBase, styles.textOpaque]}>{value}</Text>
      {bottomValue && (
        <Text style={[styles.textBase, styles.textOpaque]}>{bottomValue}</Text>
      )}
    </View>
  );
};

export default MyWitnessDataBlock;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '50%',
    },
    textBold: {
      fontFamily: FontPoppinsName.BOLD,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    textOpaque: {
      opacity: 0.7,
    },
  });
