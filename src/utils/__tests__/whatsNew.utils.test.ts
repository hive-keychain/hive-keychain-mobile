import {WhatsNewUtils} from '../whatsNew.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {VersionLogUtils} from '../version.utils';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../version.utils');

describe('WhatsNewUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveLastSeen', () => {
    it('should save last seen version to AsyncStorage', async () => {
      (VersionLogUtils.getCurrentMobileAppVersion as jest.Mock).mockReturnValue({
        version: '2.10.1',
      });

      await WhatsNewUtils.saveLastSeen();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.LAST_VERSION_UPDATE,
        '2.10',
      );
    });

    it('should handle version with patch number', async () => {
      (VersionLogUtils.getCurrentMobileAppVersion as jest.Mock).mockReturnValue({
        version: '1.5.3',
      });

      await WhatsNewUtils.saveLastSeen();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.LAST_VERSION_UPDATE,
        '1.5',
      );
    });

    it('should handle single digit versions', async () => {
      (VersionLogUtils.getCurrentMobileAppVersion as jest.Mock).mockReturnValue({
        version: '3.0.0',
      });

      await WhatsNewUtils.saveLastSeen();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        KeychainStorageKeyEnum.LAST_VERSION_UPDATE,
        '3.0',
      );
    });
  });
});












