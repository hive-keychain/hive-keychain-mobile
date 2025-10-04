import ArrowLeftDark from 'assets/images/common-ui/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/images/common-ui/arrow_left_light.svg';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
  onPress: () => void;
};

export default function BackNavigationButton({theme, onPress}: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {theme === Theme.LIGHT ? <ArrowLeftLight /> : <ArrowLeftDark />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
