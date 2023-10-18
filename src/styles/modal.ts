import {StyleProp, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {BACKGROUNDDARKBLUE, getColors} from './colors';

export const getModalBaseStyle = (theme: Theme) => {
  return {
    roundedTop: {
      backgroundColor: getColors(theme).cardBgColor,
      borderColor: getColors(theme).cardBorderColor,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderWidth: 1,
      borderRadius: 22,
    } as StyleProp<ViewStyle>,
    backgroundDarkStyle: {
      backgroundColor: BACKGROUNDDARKBLUE,
      opacity: 0.5,
    } as StyleProp<ViewStyle>,
  };
};
