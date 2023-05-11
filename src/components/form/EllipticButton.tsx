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
      width: '80%',
      color: 'black',
      backgroundColor: 'black',
      height: 50,
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
