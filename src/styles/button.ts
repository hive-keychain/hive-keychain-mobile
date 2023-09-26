import {StyleProp, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';

export const getButtonStyle = (theme: Theme) => {
  return {
    outline: {
      borderColor: getColors(theme).borderContrast,
    } as StyleProp<ViewStyle>,
  };
};
