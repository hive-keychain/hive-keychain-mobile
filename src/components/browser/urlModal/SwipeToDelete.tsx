import Icon from 'components/hive/Icon';
import React, {memo} from 'react';
import {StyleSheet, View, ViewStyle, useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Icons} from 'src/enums/icons.enum';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';

type Props = {
  onDismiss: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  enabled?: boolean;
  draggable?: boolean;
};
const SwipeableItem = memo(
  ({
    onDismiss,
    children,
    containerStyle,
    enabled = true,
    draggable = false,
  }: Props) => {
    const translateX = useSharedValue(0);
    const bgTranslateX = useSharedValue(0);
    const SCREEN_WIDTH = useWindowDimensions().width;
    const SWIPE_THRESHOLD = -SCREEN_WIDTH / 5;

    const gestureHandler = Gesture.Pan()
      .enabled(enabled)
      .activeOffsetX([-5, 5])
      .hitSlop(draggable ? {left: 0, width: SCREEN_WIDTH - 60} : undefined)
      .failOffsetY([-10, 10])
      .onStart((event) => {
        event.translationX = translateX.value;
      })
      .onUpdate((event) => {
        // Only allow left swipe
        translateX.value = Math.min(0, event.translationX);
      })
      .onEnd(() => {
        if (translateX.value < SWIPE_THRESHOLD) {
          runOnJS(onDismiss)();
          translateX.value = withTiming(-SCREEN_WIDTH, {duration: 150});
          bgTranslateX.value = withTiming(-SCREEN_WIDTH, {duration: 150});
        } else {
          translateX.value = withSpring(0);
          bgTranslateX.value = withSpring(0);
        }
      });

    const bgStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: bgTranslateX.value}],
      } as any;
    });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: translateX.value}],
      } as any;
    });
    return (
      <View style={[{width: '100%'}]}>
        {/* Hidden Delete BG */}
        <Animated.View
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginLeft: 50,
              backgroundColor: PRIMARY_RED_COLOR,
              ...containerStyle,
            },
            bgStyle,
          ]}>
          <View style={styles.deleteIcon}>
            <Icon color="white" name={Icons.REMOVE} width={25} height={25} />
          </View>
        </Animated.View>
        <GestureDetector gesture={gestureHandler}>
          <Animated.View
            style={[
              {
                justifyContent: 'center',
              },
              animatedStyle,
            ]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  rowItem: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  deleteIcon: {
    position: 'absolute',
    right: 30,
    top: 18,
  },
});

export const SwipeableItemComponent = SwipeableItem;
