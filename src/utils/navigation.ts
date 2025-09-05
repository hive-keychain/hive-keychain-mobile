import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

export let navigator: NavigationContainerRef<ReactNavigation.RootParamList> =
  null;
export const setNavigator = (
  nav: NavigationContainerRef<ReactNavigation.RootParamList>,
) => {
  navigator = nav;
};

export const navigate = (name: string, params?: object) => {
  if (navigator.isReady()) {
    navigator.dispatch(CommonActions.navigate({name, params}));
  }
};

export const goBack = () => {
  if (navigator.isReady() && navigator.canGoBack()) {
    navigator.goBack();
  }
};

export const goBackAndNavigate = (name: string, params?: object) => {
  goBack();
  navigate(name, params);
};

export const resetStackAndNavigate = (name: string) => {
  if (navigator.isReady()) {
    navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name}],
      }),
    );
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

export const modalOptions = {
  headerShown: false,
  animation: 'none',
  cardStyle: {backgroundColor: 'transparent'},
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}: any) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.1, 0.3, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.7],
        extrapolate: 'clamp',
      }),
    },
  }),
};
