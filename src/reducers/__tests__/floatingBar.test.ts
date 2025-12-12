import floatingBarReducer from '../floatingBar';
import {
  SCROLL_SHOW_FLOATING_BAR,
  UPDATE_SHOW_PROPOSAL_REMINDER,
  SET_IS_LOADING_SCREEN,
  SET_IS_DRAWER_OPEN,
  HIDE_FLOATING_BAR,
} from 'actions/types';

describe('floatingBar reducer', () => {
  const initialState = {
    showBasedOnScroll: false,
    isLoadingScreen: true,
    isDrawerOpened: false,
    isProposalRequestDisplayed: false,
    hide: false,
  };

  it('should return initial state', () => {
    expect(floatingBarReducer(undefined, {type: 'UNKNOWN'})).toEqual(
      initialState,
    );
  });

  it('should handle SCROLL_SHOW_FLOATING_BAR', () => {
    const action = {
      type: SCROLL_SHOW_FLOATING_BAR,
      payload: {showBasedOnScroll: true},
    };
    const result = floatingBarReducer(initialState, action);
    expect(result.showBasedOnScroll).toBe(true);
  });

  it('should handle UPDATE_SHOW_PROPOSAL_REMINDER', () => {
    const action = {
      type: UPDATE_SHOW_PROPOSAL_REMINDER,
      payload: {isProposalRequestDisplayed: true},
    };
    const result = floatingBarReducer(initialState, action);
    expect(result.isProposalRequestDisplayed).toBe(true);
  });

  it('should handle SET_IS_LOADING_SCREEN', () => {
    const action = {
      type: SET_IS_LOADING_SCREEN,
      payload: {isLoadingScreen: false},
    };
    const result = floatingBarReducer(initialState, action);
    expect(result.isLoadingScreen).toBe(false);
  });

  it('should handle SET_IS_DRAWER_OPEN', () => {
    const action = {
      type: SET_IS_DRAWER_OPEN,
      payload: {isDrawerOpened: true},
    };
    const result = floatingBarReducer(initialState, action);
    expect(result.isDrawerOpened).toBe(true);
  });

  it('should handle HIDE_FLOATING_BAR', () => {
    const action = {
      type: HIDE_FLOATING_BAR,
      payload: {},
    };
    const result = floatingBarReducer(initialState, action);
    expect(result.hide).toBe(true);
    expect(result.showBasedOnScroll).toBe(true);
  });

  it('should toggle hide on multiple HIDE_FLOATING_BAR actions', () => {
    const action = {
      type: HIDE_FLOATING_BAR,
      payload: {},
    };
    const result1 = floatingBarReducer(initialState, action);
    const result2 = floatingBarReducer(result1, action);
    expect(result2.hide).toBe(false);
  });

  it('should return state unchanged for unknown action', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = floatingBarReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});
















