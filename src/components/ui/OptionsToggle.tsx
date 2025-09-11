import CheckBox from 'components/form/CustomCheckBox';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  getFontSizeSmallDevices,
} from 'src/styles/typography';

type Props = {
  children: React.ReactNode[] | React.ReactNode;
  title: string;
  callback: (toggled: boolean) => void;
  toggled: boolean;
  theme: Theme;
  additionalTitleStyle?: StyleProp<TextStyle>;
  additionalContainerStyle?: StyleProp<ViewStyle>;
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
  additionalContainerStyle,
}: Props) => {
  const styles = getStyles(theme, useWindowDimensions());
  const {width} = useWindowDimensions();

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <View style={styles.header}>
        <CheckBox
          checked={toggled}
          onPress={() => {
            callback(!toggled);
          }}
          title={title}
          skipTranslation
        />
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
