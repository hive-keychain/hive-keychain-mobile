import {Notification} from 'src/interfaces/notifications.interface';
import {RootState} from 'store';
import {PeakDNotificationsUtils} from 'utils/notifications.utils';
import {ActionPayload} from './interfaces';
import {LOAD_NOTIFICATIONS, MARK_ALL_NOTIFICATIONS_AS_READ} from './types';

export const loadNotifications =
  (username: string, initialList?: Notification[]) =>
  async (dispatch: any, getState: () => RootState) => {
    const notifications = await PeakDNotificationsUtils.getAllNotifications(
      username,
      getState().properties.globals,
      initialList,
    );
    dispatch({
      type: LOAD_NOTIFICATIONS,
      payload: notifications,
    });
  };

export const markAllNotificationsAsRead = (): ActionPayload<void> => {
  return {
    type: MARK_ALL_NOTIFICATIONS_AS_READ,
  };
};
