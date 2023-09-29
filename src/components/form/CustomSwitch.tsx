import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {
  BACKGROUNDDARKBLUE,
  BACKGROUNDITEMDARKISH,
  BACKGROUNDLIGHTVARIANTLIGHTBLUE,
  getColors,
} from 'src/styles/colors';

interface Props {
  onValueChange: (value: any) => void;
  theme: Theme;
  iconLeftSide: JSX.Element;
  iconRightSide: JSX.Element;
  initalValue: boolean;
  valueTrue: any;
  valueFalse: any;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalIconContainerStyle?: StyleProp<ViewStyle>;
}

const CustomSwitch = ({
  theme,
  iconLeftSide,
  iconRightSide,
  onValueChange,
  valueFalse,
  valueTrue,
  initalValue,
  additionalContainerStyle,
  additionalIconContainerStyle,
}: Props) => {
  const [value, setValue] = React.useState(initalValue);
  const styles = getStyles(theme, value);
  const justifyStyle = value ? styles.justifyStart : styles.justifyEnd;

  React.useEffect(() => {
    onValueChange(value ? valueTrue : valueFalse);
  }, [value]);

  return (
    <View style={[styles.container, justifyStyle, additionalContainerStyle]}>
      <TouchableOpacity
        style={[styles.iconContainer, additionalIconContainerStyle]}
        onPress={() => setValue(!value)}>
        {value ? iconLeftSide : iconRightSide}
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
      width: '20%',
      marginRight: 8,
      marginLeft: 10,
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
  });
