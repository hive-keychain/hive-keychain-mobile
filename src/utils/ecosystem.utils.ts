import keychain from 'api/keychain';

const getDappList = async (chain: string) => {
  return keychain.get(`${chain.toLowerCase()}/ecosystem/dapps`);
};

export const EcosystemUtils = {getDappList};
