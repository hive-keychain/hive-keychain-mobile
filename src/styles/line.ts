import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';

export const getHorizontalLineStyle = (
  theme: Theme,
  width: number,
  height: number,
  marginRight?: number,
) => {
  return {
    width: width,
    height: height,
    backgroundColor: getColors(theme).quaternaryCardBorderColor,
    marginTop: 0,
    borderWidth: 0,
    margin: 0,
    marginRight: marginRight ?? 0,
  };
};
