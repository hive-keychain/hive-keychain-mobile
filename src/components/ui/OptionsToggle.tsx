import {RadioButton} from 'components/form/CustomRadioGroup';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  useWindowDimensions,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  body_primary_body_1,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';

type Props = {
  type: 'checkbox' | 'option';
  children: JSX.Element[];
  title: string;
  callback: (toggled: boolean) => void;
  toggled: boolean;
  theme: Theme;
  additionalTitleStyle?: StyleProp<TextStyle>;
};

const OptionsToggle = ({
  children,
  title,
  toggled,
  callback,
  theme,
  type,
  additionalTitleStyle,
}: Props) => {
  const styles = getStyles(theme, useWindowDimensions());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {type === 'option' ? (
          <RadioButton
            onSelect={() => {
              callback(!toggled);
            }}
            selected={toggled}
            style={styles.toggleButton}
            radioStyle={styles.radioStyle}
            additionalRadioStyleActive={styles.radioButtonActive}
          />
        ) : (
          <CheckBox
            checked={toggled}
            onPress={() => {
              callback(!toggled);
            }}
            containerStyle={[styles.checkbox]}
            checkedColor={PRIMARY_RED_COLOR}
            size={22}
          />
        )}
        <Text style={[styles.title, additionalTitleStyle]}>{title}</Text>
      </View>
      <View style={toggled ? styles.toggled : styles.untoggled}>
        {children}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    toggled: {flex: 1, justifyContent: 'center'},
    untoggled: {display: 'none'},
    toggleButton: {
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 15 : 20,
      height: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 15 : 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: getColors(theme).icon,
      marginLeft: 0,
      marginRight: 0,
      paddingRight: 0,
    },
    header: {
      flexDirection: 'row',
    },
    title: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_1}.fontSize,
      ),
    },
    radioButtonActive: {
      backgroundColor: getColors(theme).icon,
    },
    radioStyle: {
      width: 22,
      marginRight: 10,
    },
    checkbox: {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: getColors(theme).senaryCardBorderColor,
      borderRadius: 20,
      padding: 0,
      margin: 0,
    },
  });

export default OptionsToggle;
