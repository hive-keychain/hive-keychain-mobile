import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { CheckBox as CheckboxRNE } from 'react-native-elements';
import { Theme, useThemeContext } from 'src/context/theme.context';
import { PRIMARY_RED_COLOR, getColors } from 'src/styles/colors';
import { inputStyle } from 'src/styles/input';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  fields_primary_text_1,
  getFontSizeSmallDevices,
  headlines_primary_headline_3,
} from 'src/styles/typography';
import { translate } from 'utils/localize';

type Props = {
  title: string;
  onPress: () => void;
  checked: boolean;
  skipTranslation?: boolean;
  smallText?: boolean;
};
const CheckBox = ({
  title,
  onPress,
  checked,
  skipTranslation,
  smallText,
}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  const checkBoxSize = width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 14 : 24;

  return (
    <CheckboxRNE
      onPress={onPress}
      checked={checked}
      title={skipTranslation ? title : translate(title)}
      containerStyle={[styles.checkBox, smallText ? {paddingVertical: 2} : {},]}
      textStyle={smallText ? styles.smallText : styles.text}
      checkedColor={PRIMARY_RED_COLOR}
      size={checkBoxSize}
    />
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    checkBox: {
      width: '95%',
      margin: 0,
      marginLeft: 10,
      backgroundColor: '#00000000',
      borderWidth: 0,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_3,
      fontSize: inputStyle(theme, width).input.fontSize,
    },
    smallText: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
      fontSize: getFontSizeSmallDevices(width, 13),
      opacity: 0.7,
    },
  });

export default CheckBox;
