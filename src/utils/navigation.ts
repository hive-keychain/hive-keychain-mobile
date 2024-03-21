import {NavigationActions} from '@react-navigation/compat';
import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

// Navigation References
let navigator: NavigationContainerRef | null;

export const setNavigator = (nav: NavigationContainerRef | null) => {
  navigator = nav;
};

export const navigate = (routeName: string, params?: object) => {
  if (navigator)
    navigator.dispatch(NavigationActions.navigate({routeName, params}));
};

export const goBack = () => {
  //@ts-ignore
  if (navigator) navigator.dispatch(NavigationActions.back());
};

export const goBackAndNavigate = (routeName: string, params?: object) => {
  goBack();
  navigate(routeName, params);
};

export const resetStackAndNavigate = (name: string) => {
  if (navigator)
    navigator.dispatch({
      ...CommonActions.reset({
        index: 0,
        routes: [{name}],
      }),
    });
};

// Navigation Options
export const headerTransparent = {
  position: 'absolute',
  backgroundColor: 'transparent',
  zIndex: 100,
  top: 0,
  left: 0,
  right: 0,
};

export const noHeader = {headerShown: false};

export const modalOptions = {
  navigationOptions: {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'transparent',
    },
  },
  options: {
    headerShown: false,
    animationEnabled: false,
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
  },
};
