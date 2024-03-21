import {StyleProp, ViewStyle} from 'react-native';

export const getRotateStyle = (degrees: string) => {
  return {
    transform: [
      {
        rotate: `${degrees}deg`,
      },
    ],
  } as StyleProp<ViewStyle>;
};
