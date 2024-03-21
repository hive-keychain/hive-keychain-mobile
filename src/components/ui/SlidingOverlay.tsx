import React, {useEffect, useState} from 'react';
import {Keyboard, Platform, View, useWindowDimensions} from 'react-native';
import {Overlay} from 'react-native-elements';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

const ReanimatedView = Animated.createAnimatedComponent(View);
type Props = {
  children: JSX.Element[];
  showOverlay: boolean;
  setShowOverlay: (e: boolean) => void;
};

const SlidingOverlay = ({children, showOverlay, setShowOverlay}: Props) => {
  const {height} = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {theme} = useThemeContext();
  const [isClosing, setIsClosing] = useState(false);

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
      overlayStyle={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'transparent',
        padding: 0,
        maxHeight: height / 2,
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
            padding: 16,
            height: '100%',
            borderTopRightRadius: 16,
            width: '100%',
          }}>
          {children}
        </ReanimatedView>
      )}
    </Overlay>
  );
};

export default SlidingOverlay;
