import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {VersionLogUtils} from './version.utils';

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
