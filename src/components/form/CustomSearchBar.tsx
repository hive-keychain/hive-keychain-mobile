import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {IconNode, InputProps} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {DARKBLUELIGHTER, getColors} from 'src/styles/colors';
import {inputStyle} from 'src/styles/input';
import {button_link_primary_small} from 'src/styles/typography';
import CustomInput from './CustomInput';

interface Props {
  theme: Theme;
  rightIcon?: IconNode;
  leftIcon?: IconNode;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalCustomInputStyle?: StyleProp<TextStyle>;
  disableFocus?: boolean;
}

const CustomSearchBar = ({
  theme,
  rightIcon,
  leftIcon,
  additionalContainerStyle,
  additionalCustomInputStyle,
  ...restProps
}: Props & InputProps) => {
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);

  return (
    <CustomInput
      placeholder="Search"
      rightIcon={rightIcon}
      leftIcon={leftIcon}
      containerStyle={[styles.container, additionalContainerStyle]}
      placeholderTextColor={
        theme === Theme.LIGHT
          ? 'rgba(33, 40, 56, 0.30)'
          : 'rgba(255, 255, 255, 0.30)'
      }
      style={[styles.inputText, additionalCustomInputStyle]}
      backgroundColor={getColors(theme).cardBgLighter}
      additionalInputContainerStyle={styles.noMarginHorizontal}
      {...restProps}
    />
  );
};

export default CustomSearchBar;

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      marginLeft: 0,
      marginRight: 0,
      width: '70%',
      borderRadius: 20,
      borderColor: theme === Theme.DARK ? DARKBLUELIGHTER : null,
      borderWidth: theme === Theme.DARK ? 1 : 0,
    },
    inputText: {
      ...button_link_primary_small,
      color: getColors(theme).secondaryText,
      fontSize: inputStyle(theme, width).input.fontSize,
      textAlignVertical: 'bottom',
      lineHeight: inputStyle(theme, width).input.fontSize,
    },
    noMarginHorizontal: {
      marginHorizontal: 0,
    },
  });
