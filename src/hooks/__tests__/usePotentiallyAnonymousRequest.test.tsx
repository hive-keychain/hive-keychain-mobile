jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      activeAccount: {
        name: 'user1',
      },
    })),
  },
}));

jest.mock('utils/keychain.utils', () => ({
  getRequiredWifType: jest.fn(() => 'active'),
  getValidAuthorityAccounts: jest.fn((accounts, method) => accounts),
}));

jest.mock('components/browser/requestOperations/components/RequestUsername', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

import {renderHook} from '@testing-library/react-native';
import usePotentiallyAnonymousRequest from '../usePotentiallyAnonymousRequest';
import {Account, KeyTypes} from 'actions/interfaces';
import {KeychainRequestTypes} from 'src/interfaces/keychain.interface';

describe('usePotentiallyAnonymousRequest', () => {
  const mockAccounts: Account[] = [
    {
      name: 'user1',
      keys: {
        active: 'STM...',
        activePubkey: 'STM...',
        memo: 'STM...',
      },
    } as Account,
    {
      name: 'user2',
      keys: {
        posting: 'STM...',
        postingPubkey: 'STM...',
      },
    } as Account,
  ];

  it('should return account key for active account', () => {
    const request = {
      type: KeychainRequestTypes.transfer,
      username: 'user1',
    } as any;
    const {result} = renderHook(() =>
      usePotentiallyAnonymousRequest(request, mockAccounts),
    );
    const key = result.current.getAccountKey();
    expect(key).toBe('STM...');
  });

  it('should return username', () => {
    const request = {
      type: KeychainRequestTypes.transfer,
      username: 'user1',
    } as any;
    const {result} = renderHook(() =>
      usePotentiallyAnonymousRequest(request, mockAccounts),
    );
    const username = result.current.getUsername();
    expect(username).toBe('user1');
  });

  it('should return memo key', () => {
    const request = {
      type: KeychainRequestTypes.transfer,
      username: 'user1',
    } as any;
    const {result} = renderHook(() =>
      usePotentiallyAnonymousRequest(request, mockAccounts),
    );
    const memoKey = result.current.getAccountMemoKey();
    expect(memoKey).toBe('STM...');
  });

  it('should return public key', () => {
    const request = {
      type: KeychainRequestTypes.transfer,
      username: 'user1',
    } as any;
    const {result} = renderHook(() =>
      usePotentiallyAnonymousRequest(request, mockAccounts),
    );
    const publicKey = result.current.getAccountPublicKey();
    expect(publicKey).toBe('STM...');
  });

  it('should find account with required key when username not provided', () => {
    const request = {
      type: KeychainRequestTypes.transfer,
    } as any;
    const {result} = renderHook(() =>
      usePotentiallyAnonymousRequest(request, mockAccounts),
    );
    const username = result.current.getUsername();
    expect(username).toBeDefined();
  });
});
