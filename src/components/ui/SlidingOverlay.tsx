import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Platform,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {inputStyle} from 'src/styles/input';
import {translate} from 'utils/localize';

const ReanimatedView = Animated.createAnimatedComponent(View);
type Props = {
  children: JSX.Element[] | JSX.Element;
  showOverlay: boolean;
  setShowOverlay: (e: boolean) => void;
  title: string;
  maxHeightPercent?: number;
};

const SlidingOverlay = ({
  children,
  showOverlay,
  setShowOverlay,
  title,
  maxHeightPercent,
}: Props) => {
  const {height} = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {theme} = useThemeContext();
  const [isClosing, setIsClosing] = useState(false);
  const {width} = useWindowDimensions();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (showOverlay) setIsClosing(false);
  }, [showOverlay]);
  return (
    <Overlay
      onBackdropPress={() => {
        setTimeout(() => setShowOverlay(false), 300);
        setIsClosing(true);
      }}
      isVisible={showOverlay}
      backdropStyle={{
        opacity: 0.6,
        backgroundColor: 'black',
      }}
      overlayStyle={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'transparent',
        padding: 0,
        maxHeight: maxHeightPercent * height || height / 2,
        minHeight: height / 3,
        shadowColor: 'transparent',
        marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
      }}>
      {!isClosing && (
        <ReanimatedView
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{
            backgroundColor: getColors(theme).secondaryCardBgColor,
            borderTopLeftRadius: 16,
            borderWidth: 1,
            borderColor: getColors(theme).quaternaryCardBorderColor,
            padding: 16,
            height: '100%',
            borderTopRightRadius: 16,
            width: '100%',
            marginBottom: -initialWindowMetrics.insets.bottom,
          }}>
          <Text
            style={[
              {alignSelf: 'center', marginBottom: 10},
              inputStyle(theme, width).label,
            ]}>
            {translate(title)}
          </Text>
          {children}
        </ReanimatedView>
      )}
    </Overlay>
  );
};

export default SlidingOverlay;
