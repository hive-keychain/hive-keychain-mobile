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
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  BUTTON_MAX_WIDTH,
  getButtonHeight,
  getButtonStyle,
} from 'src/styles/button';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getButtonBoxShadow} from 'src/styles/shadow';
import {button_link_primary_small} from 'src/styles/typography';

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
  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(width, theme);

  const [isPressed, setIsPressed] = useState(false);
  return !isLoading ? (
    <TouchableOpacity
      activeOpacity={1}
      {...props}
      style={[
        styles.button,
        getButtonStyle(theme, width).secondaryButton,
        styles.outlineButton,
        style,
        isPressed
          ? getButtonBoxShadow(isWarningButton ? PRIMARY_RED_COLOR : '#000')
          : {},
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <Text
        style={[
          styles.text,
          styles.textOutLineButton,
          isWarningButton ? {color: 'white'} : {},
          additionalTextStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  ) : (
    <View style={[style, styles.loader]}>
      <Loader animating={isLoading} />
    </View>
  );
};

const getDimensionedStyles = (width: number, theme: Theme) => {
  return StyleSheet.create({
    text: {color: 'white', fontSize: 16},
    textOutLineButton: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    outlineButton: {
      zIndex: 10,
      height: getButtonHeight(width),
      borderWidth: 1,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    button: {
      width: BUTTON_MAX_WIDTH,
      height: getButtonHeight(width),
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    loader: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });
};
