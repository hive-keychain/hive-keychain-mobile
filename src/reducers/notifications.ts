import {ActionPayload} from 'actions/interfaces';
import {
  LOAD_NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_AS_READ,
} from 'actions/types';
import {Notification} from 'src/interfaces/notifications.interface';

type NotificationsState = {
  list: Notification[];
  hasMore: boolean;
};
export default (
  state: NotificationsState = {list: [], hasMore: false},
  {type, payload}: ActionPayload<NotificationsState>,
) => {
  switch (type) {
    case LOAD_NOTIFICATIONS:
      return payload!;
    case MARK_ALL_NOTIFICATIONS_AS_READ:
      return {
        list: state.list.map((notification) => ({...notification, read: true})),
        hasMore: state.hasMore,
      };
    default:
      return state;
  }
};
