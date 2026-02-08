import {WidgetUtils} from '../widget.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WidgetAsyncStorageItem} from 'src/enums/widgets.enum';
import {NativeModules} from 'react-native';

jest.mock('react-native', () => ({
  NativeModules: {
    WidgetBridge: {
      setWidgetData: jest.fn(),
      refreshWidgets: jest.fn(),
    },
  },
}));

describe('WidgetUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addAccountBalanceList', () => {
    it('should add account to list', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([{name: 'user1', show: false}]),
      );
      await WidgetUtils.addAccountBalanceList('user2', ['user1', 'user2']);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should create new list if none exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      await WidgetUtils.addAccountBalanceList('user1', ['user1']);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
        JSON.stringify([{name: 'user1', show: false}]),
      );
    });
  });

  describe('removeAccountBalanceList', () => {
    it('should remove account from list', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([
          {name: 'user1', show: false},
          {name: 'user2', show: false},
        ]),
      );
      await WidgetUtils.removeAccountBalanceList('user1');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const callArgs = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsed = JSON.parse(callArgs);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('user2');
    });
  });

  describe('clearAccountBalanceList', () => {
    it('should remove account balance list', async () => {
      await WidgetUtils.clearAccountBalanceList();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
      );
    });
  });

  describe('scanAccountsAndSave', () => {
    it('should save all accounts', async () => {
      await WidgetUtils.scanAccountsAndSave(['user1', 'user2']);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
        JSON.stringify([
          {name: 'user1', show: false},
          {name: 'user2', show: false},
        ]),
      );
    });
  });
});
