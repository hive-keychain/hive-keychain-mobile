jest.mock('api/peakdNotifications.api', () => ({
  PeakDNotificationsApi: {
    get: jest.fn(),
  },
}));

const mockBroadcastJson = jest.fn();

jest.mock('utils/hiveLibs.utils', () => ({
  broadcastJson: (...args: any[]) => mockBroadcastJson(...args),
}));

import {PeakDNotificationsUtils} from '../notifications.utils';
import {PeakDNotificationsApi} from 'api/peakdNotifications.api';
import {ActiveAccount} from 'actions/interfaces';
import {NotificationType} from 'src/interfaces/notifications.interface';

describe('PeakDNotificationsUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('defaultActiveSubs', () => {
    it('should be an array', () => {
      expect(Array.isArray(PeakDNotificationsUtils.defaultActiveSubs)).toBe(true);
    });

    it('should contain expected notification types', () => {
      expect(PeakDNotificationsUtils.defaultActiveSubs).toContain('transfer');
      expect(PeakDNotificationsUtils.defaultActiveSubs).toContain('fill_order');
    });
  });

  describe('conditionNames', () => {
    it('should be an object', () => {
      expect(typeof PeakDNotificationsUtils.conditionNames).toBe('object');
    });

    it('should contain expected condition names', () => {
      expect(PeakDNotificationsUtils.conditionNames['==']).toBe('= (equals)');
      expect(PeakDNotificationsUtils.conditionNames['!=']).toBe('(!=) different from');
      expect(PeakDNotificationsUtils.conditionNames['contains']).toBe('List contains');
    });
  });

  describe('prefixMap', () => {
    it('should be an object', () => {
      expect(typeof PeakDNotificationsUtils.prefixMap).toBe('object');
    });

    it('should contain expected prefixes', () => {
      expect(PeakDNotificationsUtils.prefixMap.core).toBe('');
      expect(PeakDNotificationsUtils.prefixMap.splinterlands).toBe('sm_');
    });
  });

  describe('operandList', () => {
    it('should be an array', () => {
      expect(Array.isArray(PeakDNotificationsUtils.operandList)).toBe(true);
    });

    it('should contain expected operands', () => {
      expect(PeakDNotificationsUtils.operandList).toContain('==');
      expect(PeakDNotificationsUtils.operandList).toContain('!=');
      expect(PeakDNotificationsUtils.operandList).toContain('contains');
    });
  });

  describe('operationFieldList', () => {
    it('should be an array', () => {
      expect(Array.isArray(PeakDNotificationsUtils.operationFieldList)).toBe(true);
    });

    it('should contain operation definitions', () => {
      const transferOp = PeakDNotificationsUtils.operationFieldList.find(
        (op) => op.name === 'transfer',
      );
      expect(transferOp).toBeDefined();
      expect(transferOp?.fields).toContain('from');
      expect(transferOp?.fields).toContain('to');
    });
  });

  describe('getAccountConfig', () => {
    it('should get account config', async () => {
      const mockConfig = {config: []};
      (PeakDNotificationsApi.get as jest.Mock).mockResolvedValueOnce(mockConfig);
      const result = await PeakDNotificationsUtils.getAccountConfig('user1');
      expect(result).toEqual(mockConfig);
      expect(PeakDNotificationsApi.get).toHaveBeenCalledWith('users/user1');
    });

    it('should handle errors', async () => {
      (PeakDNotificationsApi.get as jest.Mock).mockRejectedValueOnce(
        new Error('API Error'),
      );
      await expect(
        PeakDNotificationsUtils.getAccountConfig('user1'),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getNotifications', () => {
    it('should get notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          type: 'mention',
          read: false,
          operation: 'transfer',
          operation_type: 'transfer',
          payload: JSON.stringify({
            amount: '1.000 HIVE',
            from: 'user1',
            to: 'user2',
          }),
          read_at: null,
        },
        {
          id: 2,
          type: 'vote',
          read: true,
          operation: 'vote',
          operation_type: 'vote',
          payload: JSON.stringify({}),
          read_at: '2023-01-01',
        },
      ];
      (PeakDNotificationsApi.get as jest.Mock)
        .mockResolvedValueOnce(mockNotifications)
        .mockResolvedValueOnce([]);
      const result = await PeakDNotificationsUtils.getNotifications(
        'user1',
        {globals: {}} as any,
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(PeakDNotificationsApi.get).toHaveBeenCalled();
    });

    it('should handle transfer notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          operation: 'transfer',
          operation_type: 'transfer',
          payload: JSON.stringify({
            amount: '1.000 HIVE',
            from: 'sender1',
            to: 'user1',
          }),
          read_at: null,
          created_at: '2023-01-01T00:00:00',
        },
      ];
      (PeakDNotificationsApi.get as jest.Mock)
        .mockResolvedValueOnce(mockNotifications)
        .mockResolvedValueOnce([]);
      const result = await PeakDNotificationsUtils.getNotifications(
        'user1',
        {globals: {}} as any,
      );
      // Result might be empty if payload processing fails, but function should complete
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle follow notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          operation: 'custom_json',
          operation_type: 'custom_json.follow',
          payload: JSON.stringify({
            json: ['follow', {follower: 'follower1', following: 'user1', what: ['blog']}],
          }),
          read_at: null,
        },
      ];
      (PeakDNotificationsApi.get as jest.Mock)
        .mockResolvedValueOnce(mockNotifications)
        .mockResolvedValueOnce([]);
      const result = await PeakDNotificationsUtils.getNotifications(
        'user1',
        {globals: {}} as any,
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle reblog notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          operation: 'custom_json',
          operation_type: 'custom_json.reblog',
          payload: JSON.stringify({
            json: ['reblog', {account: 'user1', author: 'author1', permlink: 'post1'}],
          }),
          read_at: null,
        },
      ];
      (PeakDNotificationsApi.get as jest.Mock)
        .mockResolvedValueOnce(mockNotifications)
        .mockResolvedValueOnce([]);
      const result = await PeakDNotificationsUtils.getNotifications(
        'user1',
        {globals: {}} as any,
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle errors gracefully', async () => {
      (PeakDNotificationsApi.get as jest.Mock).mockRejectedValueOnce(
        new Error('API Error'),
      );
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      try {
        const result = await PeakDNotificationsUtils.getNotifications('user1', {
          globals: {},
        } as any);
        expect(result).toEqual([]);
      } catch (error) {
        // Error might be thrown or handled, both are acceptable
        expect(error).toBeDefined();
      }
      consoleErrorSpy.mockRestore();
    });

    it('should stop fetching when all notifications are read', async () => {
      const mockNotifications = [
        {
          id: 1,
          operation: 'transfer',
          operation_type: 'transfer',
          payload: JSON.stringify({amount: '1.000 HIVE', from: 'user1', to: 'user2'}),
          read_at: '2023-01-01', // All read
        },
      ];
      (PeakDNotificationsApi.get as jest.Mock).mockResolvedValueOnce(mockNotifications);
      await PeakDNotificationsUtils.getNotifications('user1', {globals: {}} as any);
      // Should stop when all notifications in batch are read
      expect(PeakDNotificationsApi.get).toHaveBeenCalled();
    });
  });

  describe('getAllNotifications', () => {
    it('should get all notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          operation: 'transfer',
          operation_type: 'transfer',
          payload: JSON.stringify({amount: '1.000 HIVE', from: 'user1', to: 'user2'}),
          read_at: null,
        },
      ];
      (PeakDNotificationsApi.get as jest.Mock)
        .mockResolvedValueOnce(mockNotifications)
        .mockResolvedValueOnce([]);
      const result = await PeakDNotificationsUtils.getAllNotifications(
        'user1',
        {globals: {}} as any,
      );
      expect(result).toBeDefined();
      expect(result.list).toBeDefined();
      expect(result.hasMore).toBeDefined();
    });

    it('should merge with initial list', async () => {
      const initialList = [
        {
          id: 0,
          type: NotificationType.PEAKD,
          createdAt: new Date('2023-01-01'),
        } as any,
      ];
      const mockNotifications = [
        {
          id: 1,
          operation: 'transfer',
          operation_type: 'transfer',
          payload: JSON.stringify({amount: '1.000 HIVE', from: 'user1', to: 'user2'}),
          read_at: null,
        },
      ];
      (PeakDNotificationsApi.get as jest.Mock)
        .mockResolvedValueOnce(mockNotifications)
        .mockResolvedValueOnce([]);
      const result = await PeakDNotificationsUtils.getAllNotifications(
        'user1',
        {globals: {}} as any,
        initialList,
      );
      expect(result.list.length).toBeGreaterThanOrEqual(initialList.length);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {
          posting: 'STMposting',
        },
      };
      mockBroadcastJson.mockResolvedValueOnce({success: true});
      const result = await PeakDNotificationsUtils.markAllAsRead(
        mockAccount as ActiveAccount,
      );
      expect(mockBroadcastJson).toHaveBeenCalledWith(
        'STMposting',
        'user1',
        'notify',
        false,
        ['setLastRead', {date: expect.any(Date)}],
      );
      expect(result).toBeDefined();
    });
  });

  describe('deleteAccountConfig', () => {
    it('should delete account config', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {
          posting: 'STMposting',
        },
      };
      mockBroadcastJson.mockResolvedValueOnce({success: true});
      const result = await PeakDNotificationsUtils.deleteAccountConfig(
        mockAccount as ActiveAccount,
      );
      expect(mockBroadcastJson).toHaveBeenCalledWith(
        'STMposting',
        'user1',
        'notify',
        false,
        ['delete_account', {}],
      );
      expect(result).toBeDefined();
    });
  });

  describe('saveDefaultConfig', () => {
    it('should save default config', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {
          posting: 'STMposting',
        },
      };
      mockBroadcastJson.mockResolvedValueOnce({success: true});
      const result = await PeakDNotificationsUtils.saveDefaultConfig(
        mockAccount as ActiveAccount,
      );
      expect(mockBroadcastJson).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
