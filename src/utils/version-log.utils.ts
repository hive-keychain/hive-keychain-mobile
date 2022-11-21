import api from 'api/keychain';
import {name} from 'package.json';
import VersionInfo from 'react-native-version-info';

interface AppInfo {
  name: string;
  version: string;
}

const getCurrentMobileAppVersion = (): AppInfo => {
  const appVersionVersionInfo = VersionInfo.appVersion;
  console.log({appVersionVersionInfo}); //TODO to remove actual -> "1.10.6-dev"
  //TODO change back to version: appVersionVersionInfo
  return {name, version: '2.8.6-dev'};
};

const getLastVersion = async () => {
  const response = await api.get('/hive/last-extension-version'); ///hive/last-extension-version-mobile
  //added while working on it
  response.data = {...response.data, version: '2.8'};
  //end added
  return response.data;
};

export const VersionLogUtils = {
  getLastVersion,
  getCurrentMobileAppVersion,
};
