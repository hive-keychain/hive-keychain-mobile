import {
  loadNotifications,
  markAllNotificationsAsRead,
} from '../notifications';
import {LOAD_NOTIFICATIONS, MARK_ALL_NOTIFICATIONS_AS_READ} from '../types';
import {PeakDNotificationsUtils} from 'utils/notifications.utils';
import {Notification} from 'src/interfaces/notifications.interface';

jest.mock('utils/notifications.utils');

describe('notifications actions', () => {
  describe('loadNotifications', () => {
    it('should dispatch action with loaded notifications', async () => {
      const mockNotifications = {
        list: [
          {
            id: '1',
            type: 'transfer',
            read: false,
          } as Notification,
        ],
        hasMore: true,
      };
      (PeakDNotificationsUtils.getAllNotifications as jest.Mock).mockResolvedValueOnce(
        mockNotifications,
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        properties: {globals: {}},
      })) as any;
      const thunk = loadNotifications('testuser');

      await thunk(dispatch, getState);

      expect(PeakDNotificationsUtils.getAllNotifications).toHaveBeenCalledWith(
        'testuser',
        {},
        undefined,
      );
      expect(dispatch).toHaveBeenCalledWith({
        type: LOAD_NOTIFICATIONS,
        payload: mockNotifications,
      });
    });

    it('should handle initial list parameter', async () => {
      const initialList = [{id: '1', type: 'mention'} as Notification];
      const mockNotifications = {
        list: initialList,
        hasMore: false,
      };
      (PeakDNotificationsUtils.getAllNotifications as jest.Mock).mockResolvedValueOnce(
        mockNotifications,
      );

      const dispatch = jest.fn();
      const getState = jest.fn(() => ({
        properties: {globals: {}},
      })) as any;
      const thunk = loadNotifications('testuser', initialList);

      await thunk(dispatch, getState);

      expect(PeakDNotificationsUtils.getAllNotifications).toHaveBeenCalledWith(
        'testuser',
        {},
        initialList,
      );
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should create action to mark all notifications as read', () => {
      const action = markAllNotificationsAsRead();
      expect(action.type).toBe(MARK_ALL_NOTIFICATIONS_AS_READ);
    });
  });
});
