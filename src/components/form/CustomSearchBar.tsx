import React from 'react';
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {InputProps} from 'react-native-elements';
import {IconNode} from 'react-native-elements/dist/icons/Icon';
import {Theme} from 'src/context/theme.context';
import {DARKBLUELIGHTER, getColors} from 'src/styles/colors';
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
  const styles = getStyles(theme);

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

const getStyles = (theme: Theme) =>
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
      textAlignVertical: 'center',
    },
    noMarginHorizontal: {
      marginHorizontal: 0,
    },
  });
