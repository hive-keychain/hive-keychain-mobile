import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {inputStyle} from 'src/styles/input';
import {fields_primary_text_1} from 'src/styles/typography';
import {translate} from 'utils/localize';
import CheckBox from './CustomCheckBox';

type Props = {
  title: string;
  onPress: () => void;
  checked: boolean;
  subTitle?: string;
  skipTranslation?: boolean;
  skipSubtitleTranslation?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  smallText?: boolean;
};
const CheckBoxPanel = ({
  subTitle,
  skipSubtitleTranslation,
  containerStyle,
  smallText,
  ...props
}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);

  return (
    <View
      style={[
        getCardStyle(theme).defaultCardItem,
        styles.checkBoxContainer,
        containerStyle,
      ]}>
      <CheckBox {...props} smallText={smallText} />
      {!!subTitle ? (
        <Text
          style={[
            styles.textInfo,
            styles.smallerFont,
            styles.paddingHorizontal,
          ]}>
          {skipSubtitleTranslation ? subTitle : translate(subTitle)}
        </Text>
      ) : null}
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    paddingHorizontal: {
      paddingHorizontal: 10,
    },
    textInfo: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
      fontSize: inputStyle(theme, width).input.fontSize,
      opacity: 0.7,
    },
    smallerFont: {
      fontSize: 12,
    },

    checkBoxContainer: {
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      flexGrow: 1,
    },
  });

export default CheckBoxPanel;
