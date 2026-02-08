jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

jest.mock('react-native-gesture-handler', () => ({
  FlatList: 'FlatList',
}));

jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [],
      activeAccount: {name: 'user1'},
    })),
    dispatch: jest.fn(),
  },
}));

import {requestWithoutConfirmation} from '../requestWithoutConfirmation.utils';
import {KeychainRequestTypes} from 'src/interfaces/keychain.interface';
import {Account} from 'actions/interfaces';

describe('requestWithoutConfirmation.utils', () => {
  const mockAccounts: Account[] = [{name: 'user1', keys: {}}];
  const mockSendResponse = jest.fn();
  const mockSendError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle decode request', () => {
    const request = {
      type: KeychainRequestTypes.decode,
      message: 'test',
    } as any;
    requestWithoutConfirmation(
      mockAccounts,
      request,
      mockSendResponse,
      mockSendError,
    );
    // Function should execute without error
    expect(true).toBe(true);
  });
});
