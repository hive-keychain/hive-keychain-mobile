import AsyncStorage from '@react-native-community/async-storage';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {VersionLogUtils} from './version-log.utils';

const saveLastSeen = async () => {
  const currentAppVersion = VersionLogUtils.getCurrentMobileAppVersion()
    .version.split('.')
    .splice(0, 2)
    .join('.');

  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.LAST_VERSION_UPDATE,
    currentAppVersion,
  );
};

export const WhatsNewUtils = {
  saveLastSeen,
};
