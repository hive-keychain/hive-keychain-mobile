import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import Icon from '../hive/Icon';

interface BackToTopButtonProps {
  element: any;
  theme: Theme;
  isScrollView?: boolean;
  additionalOverlayButtonStyle?: StyleProp<ViewStyle>;
}

export const BackToTopButton = (props: BackToTopButtonProps) => {
  const scrollToTop = () => {
    if (props.element && props.element.current) {
      try {
        if (!props.isScrollView) {
          props.element.current.scrollToIndex({animated: true, index: 0});
        } else {
          props.element.current.scrollTo({
            x: 0,
            y: 0,
            animated: true,
          });
        }
      } catch (error) {
        console.log('Error scrolling list: ', {error});
      }
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={scrollToTop}
      style={[styles.overlayButton, props.additionalOverlayButtonStyle]}>
      <View>
        <Icon name={Icons.ARROW_UP} theme={props.theme} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlayButton: {
    justifyContent: 'center',
    borderRadius: 100,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 45,
    height: 45,
    backgroundColor: PRIMARY_RED_COLOR,
  },
});
