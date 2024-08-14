import keychain from 'api/keychain';
import {dAppCategory} from 'components/browser/HomeTab/Explore';

const getDappList = async (chain: string): Promise<dAppCategory[]> => {
  return (await keychain.get(`${chain.toLowerCase()}/ecosystem/dapps`)).data;
};

export const EcosystemUtils = {getDappList};
