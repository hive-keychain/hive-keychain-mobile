import Loader from 'components/ui/Loader';
import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {
  BUTTON_MAX_HEIGHT,
  BUTTON_MAX_WIDTH,
  getButtonHeight,
} from 'src/styles/button';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getButtonBoxShadow} from 'src/styles/shadow';

interface Props {
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  additionalTextStyle?: StyleProp<TextStyle>;
  isWarningButton?: boolean;
}
export default ({
  style,
  isLoading = false,
  title,
  additionalTextStyle,
  isWarningButton,
  ...props
}: Props) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  const [isPressed, setIsPressed] = useState(false);
  return !isLoading ? (
    <TouchableOpacity
      activeOpacity={1}
      {...props}
      style={[
        styles.button,
        style,
        isPressed
          ? getButtonBoxShadow(isWarningButton ? PRIMARY_RED_COLOR : '#000')
          : {},
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Text style={[styles.text, additionalTextStyle]}>{title}</Text>
    </TouchableOpacity>
  ) : (
    <View style={[style, styles.loader]}>
      <Loader animating={isLoading} />
    </View>
  );
};

const getDimensionedStyles = ({width}: {width: number}) => {
  return StyleSheet.create({
    text: {color: 'white', fontSize: 16},
    button: {
      marginHorizontal: width * 0.1,
      width: BUTTON_MAX_WIDTH,
      color: 'black',
      backgroundColor: 'black',
      height: width ? getButtonHeight(width) : BUTTON_MAX_HEIGHT,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loader: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });
};
