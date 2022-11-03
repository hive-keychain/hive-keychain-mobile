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
  return {name, version: '2.2.6-dev'};
};

//  TODO:
//  - clone the api repo: https://github.com/hive-keychain/hive-keychain-api
//      - run the server locally.
//      - change api.EP locally in mobile app.
//      - ask quentin if i must add the info for mobile(same structure as cedric did), enable it on
//          api + test it on app.
//      - if yes, then change to mobile EP as: '/hive/last-extension-version-mobile'
const getLastVersion = async () => {
  const response = await api.get('/hive/last-extension-version');
  return response.data;
};

export const VersionLogUtils = {
  getLastVersion,
  getCurrentMobileAppVersion,
};
