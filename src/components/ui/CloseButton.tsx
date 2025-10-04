import CloseIconDark from 'assets/images/common-ui/close_circle_dark.svg';
import CloseIconLight from 'assets/images/common-ui/close_circle_light.svg';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Theme} from 'src/context/theme.context';

type Props = {
  theme: Theme;
  onPress: () => void;
};

export default function CloseButton({theme, onPress}: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {theme === Theme.LIGHT ? <CloseIconLight /> : <CloseIconDark />}
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
