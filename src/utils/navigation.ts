import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

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
    navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            // Ensure nested navigation to drawer route like 'WALLET'
            params: {screen: name},
          },
        ],
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
