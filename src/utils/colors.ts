import keychain from 'api/keychain';
import {Theme, ThemeOpacity} from 'src/context/theme.context';

let imgColors: any = {};

export const downloadColors = async () => {
  imgColors = await keychain.get('hive/tokensBackgroundColors');
  console.log({imgColors}); //TODO remove line
};

export const getBackgroundColorFromBackend = (symbol: string, theme: Theme) => {
  //TODO remove block
  if (symbol === 'BEE') {
    console.log({beeColor: imgColors.data['BEE']});
  }
  //end block
  return imgColors.data[symbol] + ThemeOpacity[theme];
};
