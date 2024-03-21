import keychain from 'api/keychain';
import {Theme, ThemeOpacity} from 'src/context/theme.context';

let imgColors: any = {};

export const downloadColors = async () => {
  imgColors = await keychain.get('hive/tokensBackgroundColors');
};

export const getBackgroundColorFromBackend = (symbol: string, theme: Theme) => {
  return imgColors.data[symbol] + ThemeOpacity[theme];
};
