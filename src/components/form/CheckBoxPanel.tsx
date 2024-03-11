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
import {
  fields_primary_text_1,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
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
};
const CheckBoxPanel = ({
  subTitle,
  skipSubtitleTranslation,
  containerStyle,
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
      <CheckBox {...props} />
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
      fontSize: getFontSizeSmallDevices(width, 15),
      opacity: 0.7,
    },
    smallerFont: {
      fontSize: 12,
    },

    checkBoxContainer: {
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 4,
      width: '100%',
    },
  });

export default CheckBoxPanel;