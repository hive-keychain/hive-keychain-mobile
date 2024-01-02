import Loader from 'components/ui/Loader';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {BUTTON_MAX_HEIGHT, BUTTON_MAX_WIDTH} from 'src/styles/button';

interface Props {
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  additionalTextStyle?: StyleProp<TextStyle>;
}
export default ({
  style,
  isLoading = false,
  title,
  additionalTextStyle,
  ...props
}: Props) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  return !isLoading ? (
    <TouchableOpacity {...props} style={[styles.button, style]}>
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
      height: BUTTON_MAX_HEIGHT,
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
