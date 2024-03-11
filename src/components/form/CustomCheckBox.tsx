import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {CheckBox as CheckboxRNE} from 'react-native-elements';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  getFontSizeSmallDevices,
  headlines_primary_headline_3,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

type Props = {
  title: string;
  onPress: () => void;
  checked: boolean;
  skipTranslation?: boolean;
};
const CheckBox = ({title, onPress, checked, skipTranslation}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  const checkBoxSize = width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 14 : 24;

  return (
    <CheckboxRNE
      onPress={onPress}
      checked={checked}
      title={skipTranslation ? title : translate(title)}
      containerStyle={styles.checkBox}
      textStyle={styles.text}
      checkedColor={PRIMARY_RED_COLOR}
      size={checkBoxSize}
    />
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    checkBox: {
      width: '99%',
      margin: 0,
      paddingLeft: 0,
      backgroundColor: '#00000000',
      borderWidth: 0,
      alignContent: 'center',
    },
    text: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_3,
      fontSize: getFontSizeSmallDevices(width, 15),
      paddingRight: 5,
    },
  });

export default CheckBox;