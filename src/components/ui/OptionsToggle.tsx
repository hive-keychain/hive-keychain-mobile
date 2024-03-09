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
  body_primary_body_1,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';

type Props = {
  children: JSX.Element[];
  title: string;
  callback: (toggled: boolean) => void;
  toggled: boolean;
  theme: Theme;
  additionalTitleStyle?: StyleProp<TextStyle>;
};
/**
 * Note: Using a checkbox, to toogle children components
 */
const OptionsToggle = ({
  children,
  title,
  toggled,
  callback,
  theme,
  additionalTitleStyle,
}: Props) => {
  const styles = getStyles(theme, useWindowDimensions());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CheckBox
          checked={toggled}
          onPress={() => {
            callback(!toggled);
          }}
          containerStyle={[styles.checkbox]}
          checkedColor={PRIMARY_RED_COLOR}
          size={22}
        />

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
      // height: 'auto',
    },
    toggled: {},
    untoggled: {display: 'none'},
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
    checkbox: {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: getColors(theme).senaryCardBorderColor,
      borderRadius: 20,
      padding: 0,
      margin: 0,
    },
  });

export default OptionsToggle;
