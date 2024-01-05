import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  ScaledSize,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import KeychainLogo from './KeychainLogo';

interface Props {
  color?: string;
  size?: 'small' | 'large' | number;
  animating?: boolean;
  animatedLogo?: boolean;
}
export default ({
  color = '#E31337',
  size = 'large',
  animating = false,
  animatedLogo,
}: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {theme} = useThemeContext();

  const dots = 3;

  const styles = getDimensionedStyles(useWindowDimensions(), theme);

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [fadeAnim]);

  return animatedLogo ? (
    <View style={styles.mainContainer}>
      <KeychainLogo theme={theme} using_new_ui width={150} />
      <View style={styles.container}>
        {Array.from(Array(dots)).map((e, i) => {
          return (
            <Animated.View
              key={i}
              style={{
                ...styles.indicator,
                backgroundColor: getColors(theme).secondaryText,
                opacity: fadeAnim,
              }}
            />
          );
        })}
      </View>
    </View>
  ) : (
    <ActivityIndicator color={color} size={size} animating={animating} />
  );
};

const getDimensionedStyles = ({width}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    mainContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    container: {
      marginTop: 30,
      display: 'flex',
      flexDirection: 'row',
      width: '60%',
      justifyContent: 'space-evenly',
      alignContent: 'center',
    },
    indicator: {
      backgroundColor: 'transparent',
      width: width / 25,
      height: width / 25,
      borderRadius: width / 40,
      borderColor: getColors(theme).secondaryText,
      borderWidth: 1,
      opacity: theme === Theme.LIGHT ? 0.7 : 1,
    },
  });
