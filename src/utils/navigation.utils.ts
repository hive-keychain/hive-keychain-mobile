import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';

export let navigator: NavigationContainerRef<ReactNavigation.RootParamList> =
  null;
export const setNavigator = (
  nav: NavigationContainerRef<ReactNavigation.RootParamList>,
) => {
  navigator = nav;
};

export const navigate = (name: string, params?: object) => {
  if (navigator && 'isReady' in navigator && navigator.isReady()) {
    navigator.dispatch(CommonActions.navigate({name, params}));
  }
};

export const goBack = () => {
  if (
    navigator &&
    'isReady' in navigator &&
    navigator.isReady() &&
    navigator.canGoBack()
  ) {
    navigator.goBack();
  }
};

export const goBackAndNavigate = (name: string, params?: object) => {
  goBack();
  navigate(name, params);
};

export const resetStackAndNavigate = (name: string) => {
  if (navigator && 'isReady' in navigator && navigator.isReady()) {
    if (name !== 'Wallet') {
      navigator.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              // Ensure nested navigation to drawer route like 'Wallet
              params: {screen: name},
            },
          ],
        }),
      );
    } else {
      navigator.dispatch(StackActions.popToTop());
      navigator.dispatch(CommonActions.navigate({name}));
    }
  }
};

// Screen options
export const headerTransparent = {
  position: 'absolute' as const,
  backgroundColor: 'transparent',
  zIndex: 100,
  top: 0,
  left: 0,
  right: 0,
};

export const noHeader = {headerShown: false};

// Shared default iOS-style horizontal back-swipe gesture options for stacks
export const iosHorizontalSwipeBack = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  gestureResponseDistance: 50,
} as const;

// Shared iOS-style horizontal transition options with consistent background and perf tweaks
export const buildIOSHorizontalStackOptions = (
  backgroundColor: string,
  opts?: {detachPreviousScreen?: boolean},
) =>
  ({
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
    detachPreviousScreen: opts?.detachPreviousScreen ?? false,
    cardShadowEnabled: false,
    cardOverlayEnabled: false,
    cardStyle: {backgroundColor},
  } as const);
