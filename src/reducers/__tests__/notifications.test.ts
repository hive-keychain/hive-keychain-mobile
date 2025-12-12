import reducer from '../notifications';
import {LOAD_NOTIFICATIONS, MARK_ALL_NOTIFICATIONS_AS_READ} from 'actions/types';
import {Notification} from 'src/interfaces/notifications.interface';

describe('notifications reducer', () => {
  const initialState = {list: [], hasMore: false};

  it('should return initial state', () => {
    expect(reducer(undefined, {type: 'UNKNOWN'})).toEqual(initialState);
  });

  it('should handle LOAD_NOTIFICATIONS', () => {
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'vote',
        read: false,
        timestamp: '2023-01-01T00:00:00',
        source: 'user1',
        target: 'user2',
      },
      {
        id: '2',
        type: 'comment',
        read: false,
        timestamp: '2023-01-02T00:00:00',
        source: 'user2',
        target: 'user1',
      },
    ];
    const payload = {list: notifications, hasMore: true};
    const action = {type: LOAD_NOTIFICATIONS, payload};
    const result = reducer(initialState, action);
    expect(result.list).toEqual(notifications);
    expect(result.hasMore).toBe(true);
  });

  it('should handle LOAD_NOTIFICATIONS with hasMore false', () => {
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'vote',
        read: false,
        timestamp: '2023-01-01T00:00:00',
        source: 'user1',
        target: 'user2',
      },
    ];
    const payload = {list: notifications, hasMore: false};
    const action = {type: LOAD_NOTIFICATIONS, payload};
    const result = reducer(initialState, action);
    expect(result.hasMore).toBe(false);
  });

  it('should handle MARK_ALL_NOTIFICATIONS_AS_READ', () => {
    const state = {
      list: [
        {
          id: '1',
          type: 'vote',
          read: false,
          timestamp: '2023-01-01T00:00:00',
          source: 'user1',
          target: 'user2',
        },
        {
          id: '2',
          type: 'comment',
          read: false,
          timestamp: '2023-01-02T00:00:00',
          source: 'user2',
          target: 'user1',
        },
      ],
      hasMore: true,
    };
    const action = {type: MARK_ALL_NOTIFICATIONS_AS_READ};
    const result = reducer(state, action);
    expect(result.list[0].read).toBe(true);
    expect(result.list[1].read).toBe(true);
    expect(result.hasMore).toBe(true);
  });

  it('should preserve hasMore when marking all as read', () => {
    const state = {
      list: [
        {
          id: '1',
          type: 'vote',
          read: false,
          timestamp: '2023-01-01T00:00:00',
          source: 'user1',
          target: 'user2',
        },
      ],
      hasMore: false,
    };
    const action = {type: MARK_ALL_NOTIFICATIONS_AS_READ};
    const result = reducer(state, action);
    expect(result.hasMore).toBe(false);
  });

  it('should handle empty notification list', () => {
    const payload = {list: [], hasMore: false};
    const action = {type: LOAD_NOTIFICATIONS, payload};
    const result = reducer(initialState, action);
    expect(result.list).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  it('should handle marking empty list as read', () => {
    const state = {list: [], hasMore: false};
    const action = {type: MARK_ALL_NOTIFICATIONS_AS_READ};
    const result = reducer(state, action);
    expect(result.list).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  it('should handle notifications that are already read', () => {
    const state = {
      list: [
        {
          id: '1',
          type: 'vote',
          read: true,
          timestamp: '2023-01-01T00:00:00',
          source: 'user1',
          target: 'user2',
        },
      ],
      hasMore: false,
    };
    const action = {type: MARK_ALL_NOTIFICATIONS_AS_READ};
    const result = reducer(state, action);
    expect(result.list[0].read).toBe(true);
  });

  it('should handle unknown action', () => {
    const state = {
      list: [
        {
          id: '1',
          type: 'vote',
          read: false,
          timestamp: '2023-01-01T00:00:00',
          source: 'user1',
          target: 'user2',
        },
      ],
      hasMore: true,
    };
    const action = {type: 'UNKNOWN_ACTION'};
    const result = reducer(state, action);
    expect(result).toEqual(state);
  });
});









