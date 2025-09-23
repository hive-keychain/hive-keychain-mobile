import keychain from 'api/keychain.api';
import {Theme, ThemeOpacity} from 'src/context/theme.context';

export type Colors = {
  [color: string]: string;
};
export const downloadTokenBackgroundColors = async (): Promise<Colors> => {
  return (await keychain.get('hive/tokensBackgroundColors')).data;
};

export const getTokenBackgroundColor = (
  colors: Colors,
  symbol: string,
  theme: Theme,
) => {
  return colors[symbol] + ThemeOpacity[theme];
};
