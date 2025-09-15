import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {inputStyle} from 'src/styles/input';
import {translate} from 'utils/localize';

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = {
  children: React.ReactNode;
  showOverlay: boolean;
  setShowOverlay: (e: boolean) => void;
  title: string;
  maxHeightPercent?: number;
  minHeightPercent?: number;
  onDismiss?: () => void;
};

const SafeSlidingOverlay = ({
  children,
  showOverlay,
  setShowOverlay,
  title,
  maxHeightPercent = 0.6,
  minHeightPercent = 0.4,
  onDismiss,
}: Props) => {
  const {theme} = useThemeContext();
  const {height, width} = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [shouldRenderContent, setShouldRenderContent] = useState(showOverlay);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // When opening, render content immediately to avoid layout jank
  // When closing, wait for exit animation to finish before unmounting children
  useEffect(() => {
    if (showOverlay) {
      setShouldRenderContent(true);
    } else {
      const timeout = setTimeout(() => setShouldRenderContent(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [showOverlay]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={showOverlay}
      onRequestClose={() => setShowOverlay(false)}
      onDismiss={onDismiss}>
      <TouchableWithoutFeedback onPress={() => setShowOverlay(false)}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <AnimatedView
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={[
          styles.sheet,
          {
            maxHeight: height * maxHeightPercent,
            minHeight: height * minHeightPercent,
            marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
            backgroundColor: getColors(theme).secondaryCardBgColor,
            borderColor: getColors(theme).quaternaryCardBorderColor,
          },
        ]}>
        <Text style={[styles.title, inputStyle(theme, width).label]}>
          {translate(title)}
        </Text>
        {shouldRenderContent ? children : null}
      </AnimatedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 999,
    elevation: 5,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default SafeSlidingOverlay;
