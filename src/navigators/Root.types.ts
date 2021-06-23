import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParam = {
  Main: undefined;
  ModalScreen: {modalContent: JSX.Element; onForceCloseModal?: () => void};
};

export type MainNavigation = StackNavigationProp<RootStackParam, 'Main'>;

type ModalNavigation = StackNavigationProp<RootStackParam, 'ModalScreen'>;
type ModalNavigationRoute = RouteProp<RootStackParam, 'ModalScreen'>;

export type ModalNavigationProps = {
  navigation: ModalNavigation;
  route: ModalNavigationRoute;
};
