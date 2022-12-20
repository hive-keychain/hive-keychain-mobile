import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParam = {
  Main: undefined;
  ModalScreen: {
    modalContent?: JSX.Element;
    onForceCloseModal?: () => void;
    name: string;
    data?: any;
    centerModal?: boolean | undefined;
  };
};

export type MainNavigation = StackNavigationProp<RootStackParam, 'Main'>;

export type ModalNavigation = StackNavigationProp<
  RootStackParam,
  'ModalScreen'
>;
export type ModalNavigationRoute = RouteProp<RootStackParam, 'ModalScreen'>;

export type ModalNavigationProps = {
  navigation: ModalNavigation;
  route: ModalNavigationRoute;
};
