import api from 'api/keychain';
import {name} from 'package.json';
import VersionInfo from 'react-native-version-info';

interface AppInfo {
  name: string;
  version: string;
}

const getCurrentMobileAppVersion = (): AppInfo => {
  const appVersionVersionInfo = VersionInfo.appVersion;
  return {name, version: appVersionVersionInfo};
};

const getLastVersion = async () => {
  const response = await api.get('/hive/last-version-mobile');
  return response.data;
};

export const VersionLogUtils = {
  getLastVersion,
  getCurrentMobileAppVersion,
};
