import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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
        <Text style={styles.overlayButtonText}>{'TOP'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayButton: {
    justifyContent: 'center',
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 0,
    backgroundColor: 'red',
    borderWidth: 1,
    width: 50,
    height: 30,
    opacity: 0.65,
  },
  overlayButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
