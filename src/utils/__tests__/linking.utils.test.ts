import {treatHASRequest} from 'actions/hiveAuthenticationService';
import {addTabFromLinking} from 'actions/index';
import * as hiveUri from 'hive-uri';
import {Linking} from 'react-native';
import {store} from 'store';
import isURL from 'validator/lib/isURL';
import AccountUtils from '../account.utils';
import {HASConfig} from '../config.utils';
import {processQRCodeOp} from '../hiveUri.utils';
import {KeyUtils} from '../key.utils';
import {validateFromObject} from '../keyValidation.utils';
import {
  clearLinkingListeners,
  handleAddAccountQR,
  handleUrl,
} from '../linking.utils';

jest.mock('actions/hiveAuthenticationService', () => ({
  treatHASRequest: jest.fn(),
}));
jest.mock('actions/index', () => ({
  addAccount: jest.fn(),
  addTabFromLinking: jest.fn(),
}));
jest.mock('hive-uri', () => ({
  decode: jest.fn(),
}));
jest.mock('react-native', () => ({
  Linking: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
    getInitialURL: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));
jest.mock('react-native-root-toast', () => ({
  show: jest.fn(),
  durations: {
    LONG: 5000,
  },
}));
jest.mock('store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
  },
}));
jest.mock('validator/lib/isURL', () => jest.fn());
jest.mock('../account.utils', () => ({
  addAuthorizedAccount: jest.fn(),
}));
jest.mock('../hiveUri.utils', () => ({
  processQRCodeOp: jest.fn(),
}));
jest.mock('../key.utils', () => ({
  KeyUtils: {
    isAuthorizedAccount: jest.fn(),
    hasKeys: jest.fn(),
  },
}));
jest.mock('../keyValidation.utils', () => ({
  validateFromObject: jest.fn(),
}));
jest.mock('../navigation.utils', () => ({
  goBack: jest.fn(),
  goBackAndNavigate: jest.fn(),
}));

describe('linking.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleUrl', () => {
    it('should handle HAS auth request', async () => {
      const authData = {type: 'auth', username: 'testuser'};
      const base64Data = Buffer.from(JSON.stringify(authData)).toString(
        'base64',
      );
      const url = `${HASConfig.auth_req}${base64Data}`;

      await handleUrl(url, false);

      expect(treatHASRequest).toHaveBeenCalledWith(authData);
      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should handle hive://sign URL', async () => {
      const mockDecoded = {operation: 'transfer'};
      (hiveUri.decode as jest.Mock).mockReturnValue(mockDecoded);
      const url = 'hive://sign/transfer/testdata';

      await handleUrl(url, false);

      expect(hiveUri.decode).toHaveBeenCalledWith(url);
      expect(processQRCodeOp).toHaveBeenCalled();
    });

    it('should handle regular URL', async () => {
      (isURL as jest.Mock).mockReturnValue(true);
      const url = 'https://example.com';

      await handleUrl(url, false);

      expect(store.dispatch).toHaveBeenCalledWith(addTabFromLinking(url));
    });
  });

  describe('handleAddAccountQR', () => {
    it('should add account with authorized keys', async () => {
      const accountData = {
        name: 'newuser',
        keys: {
          activePubkey: 'STM8testactive',
          postingPubkey: 'STM8testposting',
        },
      };
      const data = `keychain://add_account=${JSON.stringify(accountData)}`;

      (store.getState as jest.Mock).mockReturnValue({
        accounts: [{name: 'local1'}],
      });
      (KeyUtils.isAuthorizedAccount as jest.Mock).mockReturnValue(true);
      (AccountUtils.addAuthorizedAccount as jest.Mock).mockResolvedValue({
        active: '5testactive',
      });
      (KeyUtils.hasKeys as jest.Mock).mockReturnValue(true);

      await handleAddAccountQR(data, true, false);

      expect(AccountUtils.addAuthorizedAccount).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should validate keys when not authorized', async () => {
      const accountData = {
        name: 'newuser',
        keys: {
          active: '5testactive',
        },
      };
      const data = `keychain://add_account=${JSON.stringify(accountData)}`;

      (store.getState as jest.Mock).mockReturnValue({
        accounts: [],
      });
      (KeyUtils.isAuthorizedAccount as jest.Mock).mockReturnValue(false);
      (validateFromObject as jest.Mock).mockResolvedValue({
        active: '5testactive',
        activePubkey: 'STM8testactive',
      });
      (KeyUtils.hasKeys as jest.Mock).mockReturnValue(true);

      await handleAddAccountQR(data, true, false);

      expect(validateFromObject).toHaveBeenCalledWith(accountData);
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('clearLinkingListeners', () => {
    it('should remove subscription when provided', () => {
      const mockSubscription = {remove: jest.fn()};
      clearLinkingListeners(mockSubscription);
      expect(mockSubscription.remove).toHaveBeenCalled();
    });

    it('should handle undefined subscription gracefully', () => {
      expect(() => clearLinkingListeners()).not.toThrow();
    });
  });
});
