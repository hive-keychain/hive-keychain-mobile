import {NavigationActions} from '@react-navigation/compat';

// Navigation References
let navigator;

export const setNavigator = (nav) => {
  navigator = nav;
};

export const navigate = (routeName, params) => {
  navigator.dispatch(NavigationActions.navigate({routeName, params}));
};

export const goBack = () => {
  navigator.dispatch(NavigationActions.back());
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
    cardStyle: {backgroundColor: 'transparent'},
    cardOverlayEnabled: true,
    cardStyleInterpolator: ({
      current: {progress},
      next,
      inverted,
      layouts: {screen},
    }) => ({
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
