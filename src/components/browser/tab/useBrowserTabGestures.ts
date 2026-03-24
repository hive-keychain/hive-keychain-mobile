import {toggleHideFloatingBar} from 'actions/floatingBar';
import {Gesture} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {store} from 'store';
import {BrowserConfig} from 'utils/config.utils';

type Params = {
  goBack: () => void;
  goForward: () => void;
};

export const useBrowserTabGestures = ({goBack, goForward}: Params) => {
  const dispatchToggleHideFloatingBar = () => {
    store.dispatch(toggleHideFloatingBar());
  };

  const swipeLeft = Gesture.Pan()
    .onEnd((event) => {
      const {velocityX} = event;
      if (velocityX < -300) {
        runOnJS(goForward)();
      }
    })
    .hitSlop({
      right: 0,
      width: BrowserConfig.EDGE_THRESHOLD,
    })
    .activeOffsetX([-10, 10]);

  const swipeRight = Gesture.Pan()
    .onEnd((event) => {
      const {velocityX} = event;
      if (velocityX > 300) {
        runOnJS(goBack)();
      }
    })
    .hitSlop({
      left: 0,
      width: BrowserConfig.EDGE_THRESHOLD,
    })
    .activeOffsetX([-10, 10]);

  const doubleTouch = Gesture.Tap()
    .minPointers(2)
    .onEnd(() => {
      runOnJS(dispatchToggleHideFloatingBar)();
    });

  return Gesture.Simultaneous(swipeLeft, swipeRight, doubleTouch);
};
