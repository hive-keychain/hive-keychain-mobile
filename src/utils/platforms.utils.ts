import {ReactElement} from 'react';
import {Platform} from 'react-native';

const hideOniOS = (element: ReactElement): ReactElement =>
  Platform.OS !== 'ios' ? element : null;

export const PlatformsUtils = {hideOniOS};
