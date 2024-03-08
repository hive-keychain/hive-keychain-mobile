import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  BACKGROUNDDARKBLUE,
  BACKGROUNDITEMDARKISH,
  BACKGROUNDLIGHTVARIANTLIGHTBLUE,
  getColors,
} from 'src/styles/colors';

interface Props {
  currentValue: any;
  onValueChange?: (value: any) => void;
  iconLeftSide: JSX.Element;
  iconRightSide: JSX.Element;
  valueLeft: any;
  valueRight: any;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalIconContainerStyle?: StyleProp<ViewStyle>;
}

const CustomSwitch = ({
  iconLeftSide,
  iconRightSide,
  onValueChange,
  valueLeft,
  valueRight,
  currentValue,
  additionalContainerStyle,
  additionalIconContainerStyle,
}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, currentValue === valueLeft);
  const justifyStyle =
    currentValue === valueLeft ? styles.justifyStart : styles.justifyEnd;

  const handleOnPress = () => {
    if (onValueChange)
      onValueChange(currentValue === valueLeft ? valueRight : valueLeft);
  };

  return (
    <View style={[styles.container, justifyStyle, additionalContainerStyle]}>
      <TouchableOpacity
        style={[styles.iconContainer, additionalIconContainerStyle]}
        containerStyle={styles.touchableOpacityStyle}
        onPress={handleOnPress}>
        {currentValue === valueLeft ? iconLeftSide : iconRightSide}
      </TouchableOpacity>
    </View>
  );
};

export default CustomSwitch;

const getStyles = (theme: Theme, value: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 50,
      backgroundColor: !value
        ? BACKGROUNDDARKBLUE
        : BACKGROUNDLIGHTVARIANTLIGHTBLUE,
      width: 50,
      marginRight: 10,
      padding: 0.5,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColorContrast,
    },
    justifyStart: {
      justifyContent: 'flex-start',
    },
    justifyEnd: {
      justifyContent: 'flex-end',
    },
    iconContainer: {
      backgroundColor: !value ? BACKGROUNDITEMDARKISH : '#FFF',
      padding: 2,
      borderRadius: 100,
      marginLeft: 3,
      marginRight: 3,
    },
    touchableOpacityStyle: {
      borderRadius: 100,
    },
  });
