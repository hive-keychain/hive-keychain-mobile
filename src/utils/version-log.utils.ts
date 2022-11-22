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
  //TODO remove to apply API source to load whatsnew.
  //added while working on it
  response.data = {...response.data, version: '1.10'};
  //end remove
  return response.data;
};

export const VersionLogUtils = {
  getLastVersion,
  getCurrentMobileAppVersion,
};
