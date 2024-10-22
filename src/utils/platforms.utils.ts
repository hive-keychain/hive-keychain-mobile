import {ReactElement} from 'react';
import {Platform, PlatformOSType} from 'react-native';

const showDependingOnPlatform = (
  element: ReactElement,
  show: PlatformOSType[],
): ReactElement => ((show || []).includes(Platform.OS) ? element : null);

export const PlatformsUtils = {showDependingOnPlatform};
