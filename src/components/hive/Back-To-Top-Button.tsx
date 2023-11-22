import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import Icon from './Icon';

interface BackToTopButtonProps {
  element: any;
  theme: Theme;
}

export const BackToTopButton = (props: BackToTopButtonProps) => {
  const scrollToTop = () => {
    if (props.element && props.element.current) {
      try {
        props.element.current.scrollToIndex({animated: false, index: 0});
      } catch (error) {
        //In case the list has no element TODO finish testing.
      }
    }
  };

  return (
    <View style={styles.overlayButton}>
      <TouchableOpacity onPress={scrollToTop}>
        <Icon name={'arrow_up'} theme={props.theme} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayButton: {
    justifyContent: 'center',
    borderRadius: 100,
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5,
    // borderWidth: 1,
    width: 45,
    height: 45,
    backgroundColor: PRIMARY_RED_COLOR,
  },
});
