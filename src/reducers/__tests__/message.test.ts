import messageReducer from '../message';
import {SHOW_MODAL, RESET_MODAL} from 'actions/types';
import {MessageModalType} from 'src/enums/messageModal.enum';

describe('message reducer', () => {
  const initialState = {
    key: '',
    type: MessageModalType.SUCCESS,
  };

  it('should return initial state', () => {
    expect(messageReducer(undefined, {type: 'UNKNOWN'})).toEqual(initialState);
  });

  it('should handle SHOW_MODAL', () => {
    const payload = {
      key: 'test-key',
      type: MessageModalType.ERROR,
      params: {message: 'Test'},
    };
    const action = {
      type: SHOW_MODAL,
      payload,
    };
    const result = messageReducer(initialState, action);
    expect(result).toEqual(payload);
  });

  it('should handle RESET_MODAL', () => {
    const state = {
      key: 'test-key',
      type: MessageModalType.ERROR,
    };
    const action = {
      type: RESET_MODAL,
      payload: undefined,
    };
    const result = messageReducer(state, action);
    expect(result).toEqual(initialState);
  });

  it('should return state unchanged for unknown action', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: undefined,
    };
    const result = messageReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});








