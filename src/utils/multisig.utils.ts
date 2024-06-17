import AsyncStorage from '@react-native-async-storage/async-storage';
import {MultisigAccountConfig} from 'src/interfaces/multisig.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';

const getMultisigAccountConfig = async (account: string) => {
  const multisigConfig = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.MULTISIG_CONFIG,
  );
  if (!multisigConfig) return null;
  return JSON.parse(multisigConfig)[account];
};

const saveMultisigConfig = async (
  account: string,
  newAccountConfig: MultisigAccountConfig,
) => {
  let config = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.MULTISIG_CONFIG),
  );
  if (!config) config = {};
  config[account] = newAccountConfig;
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.MULTISIG_CONFIG,
    JSON.stringify(config),
  );
};

export const MultisigUtils = {
  getMultisigAccountConfig,
  saveMultisigConfig,
};
