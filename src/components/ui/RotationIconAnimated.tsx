import Icon from 'components/hive/Icon';
import React from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';

interface Props {
  theme: Theme;
  onPressIcon: () => void;
  animate: boolean;
  color?: string;
}

const RotationIconAnimated = ({theme, onPressIcon, animate, color}: Props) => {
  const styles = getStyles(theme);
  const spinValue = new Animated.Value(0);

  Animated.timing(spinValue, {
    toValue: 1,
    duration: 3000,
    easing: Easing.linear, // Easing is an additional import from react-native
    useNativeDriver: true, // To make use of native driver for performance
  }).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate: animate ? spin : '0deg'}]}}>
      <Icon
        theme={theme}
        name={Icons.ROTATE_RIGHT_BROWSER}
        onPress={onPressIcon}
        color={color}
      />
    </Animated.View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({});

export default RotationIconAnimated;
