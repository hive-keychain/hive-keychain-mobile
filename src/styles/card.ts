import {StyleProp, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';

export const getCardStyle = (theme: Theme) => {
  return {
    defaultCardItem: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: 19,
      paddingHorizontal: 21,
      paddingVertical: 15,
      marginBottom: 8,
    } as StyleProp<ViewStyle>,
  };
};
