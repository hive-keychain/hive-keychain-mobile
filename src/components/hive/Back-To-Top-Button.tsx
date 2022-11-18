import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icons} from 'src/enums/icons.enums';
import Icon from './Icon';

interface BackToTopButtonProps {
  element: any;
}

export const BackToTopButton = (props: BackToTopButtonProps) => {
  const scrollToTop = () => {
    if (props.element && props.element.current) {
      props.element.current.scrollToIndex({animated: false, index: 0});
    }
  };

  return (
    <View style={styles.overlayButton}>
      <TouchableOpacity onPress={scrollToTop}>
        <Icon name={Icons.ARROW_UPWARDS} />
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
    borderWidth: 1,
    width: 25,
    height: 25,
  },
});
