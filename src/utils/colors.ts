import keychain from 'api/keychain';

let imgColors: any = {};

export const downloadColors = async () => {
  imgColors = await keychain.get('hive/tokensBackgroundColors');
};

export const getBackgroundColorFromBackend = (symbol: string) => {
  return imgColors.data[symbol];
};
