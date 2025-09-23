import api from 'api/keychain.api';
import Constants from 'expo-constants';
import {name} from 'package.json';

interface AppInfo {
  name: string;
  version: string;
}

const getCurrentMobileAppVersion = (): AppInfo => {
  const appVersionVersionInfo = Constants.expoConfig?.version.split('-')[0];
  return {name, version: appVersionVersionInfo};
};

const getLastVersion = async () => {
  const response = await api.get('/last-version-mobile');
  return response.data;
};

export const VersionLogUtils = {
  getLastVersion,
  getCurrentMobileAppVersion,
};
