import {ExtendedAccount} from '@hiveio/dhive';
import ProxyUtils from '../proxy.utils';
import {getClient} from '../hiveLibs.utils';

jest.mock('../hiveLibs.utils', () => ({
  getClient: jest.fn(),
}));

describe('ProxyUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserProxy', () => {
    it('should return null when user has no proxy', async () => {
      const user: ExtendedAccount = {
        name: 'testuser',
        proxy: '',
      } as ExtendedAccount;

      const result = await ProxyUtils.findUserProxy(user);

      expect(result).toBeNull();
    });

    it('should return proxy when user has direct proxy', async () => {
      const user: ExtendedAccount = {
        name: 'testuser',
        proxy: 'proxyuser',
      } as ExtendedAccount;

      const proxyAccount: ExtendedAccount = {
        name: 'proxyuser',
        proxy: '',
      } as ExtendedAccount;

      const mockDatabase = {
        getAccounts: jest.fn().mockResolvedValue([proxyAccount]),
      };
      (getClient as jest.Mock).mockReturnValue({database: mockDatabase});

      const result = await ProxyUtils.findUserProxy(user);

      expect(result).toBe('proxyuser');
    });

    it('should follow proxy chain', async () => {
      const user: ExtendedAccount = {
        name: 'testuser',
        proxy: 'proxy1',
      } as ExtendedAccount;

      const proxy1: ExtendedAccount = {
        name: 'proxy1',
        proxy: 'proxy2',
      } as ExtendedAccount;

      const proxy2: ExtendedAccount = {
        name: 'proxy2',
        proxy: '',
      } as ExtendedAccount;

      const mockDatabase = {
        getAccounts: jest
          .fn()
          .mockResolvedValueOnce([proxy1])
          .mockResolvedValueOnce([proxy2]),
      };
      (getClient as jest.Mock).mockReturnValue({database: mockDatabase});

      const result = await ProxyUtils.findUserProxy(user);

      expect(result).toBe('proxy2');
    });

    it('should return null when proxy chain loops', async () => {
      const user: ExtendedAccount = {
        name: 'testuser',
        proxy: 'proxy1',
      } as ExtendedAccount;

      const proxy1: ExtendedAccount = {
        name: 'proxy1',
        proxy: 'testuser',
      } as ExtendedAccount;

      const mockDatabase = {
        getAccounts: jest.fn().mockResolvedValue([proxy1]),
      };
      (getClient as jest.Mock).mockReturnValue({database: mockDatabase});

      const result = await ProxyUtils.findUserProxy(user);

      expect(result).toBeNull();
    });
  });
});
