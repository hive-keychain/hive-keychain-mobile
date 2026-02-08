import {
  showFloatingBar,
  updateShowProposalReminder,
  setisLoadingScreen,
  setIsDrawerOpen,
  toggleHideFloatingBar,
} from '../floatingBar';
import {
  SCROLL_SHOW_FLOATING_BAR,
  UPDATE_SHOW_PROPOSAL_REMINDER,
  SET_IS_LOADING_SCREEN,
  SET_IS_DRAWER_OPEN,
  HIDE_FLOATING_BAR,
} from '../types';

describe('floatingBar actions', () => {
  describe('showFloatingBar', () => {
    it('should create action to show floating bar', () => {
      const action = showFloatingBar(true);
      expect(action.type).toBe(SCROLL_SHOW_FLOATING_BAR);
      expect(action.payload?.showBasedOnScroll).toBe(true);
    });

    it('should handle false value', () => {
      const action = showFloatingBar(false);
      expect(action.payload?.showBasedOnScroll).toBe(false);
    });
  });

  describe('updateShowProposalReminder', () => {
    it('should create action to update proposal reminder', () => {
      const action = updateShowProposalReminder(true);
      expect(action.type).toBe(UPDATE_SHOW_PROPOSAL_REMINDER);
      expect(action.payload?.isProposalRequestDisplayed).toBe(true);
    });
  });

  describe('setisLoadingScreen', () => {
    it('should create action to set loading screen', () => {
      const action = setisLoadingScreen(true);
      expect(action.type).toBe(SET_IS_LOADING_SCREEN);
      expect(action.payload?.isLoadingScreen).toBe(true);
    });
  });

  describe('setIsDrawerOpen', () => {
    it('should create action to set drawer open state', () => {
      const action = setIsDrawerOpen(true);
      expect(action.type).toBe(SET_IS_DRAWER_OPEN);
      expect(action.payload?.isDrawerOpened).toBe(true);
    });
  });

  describe('toggleHideFloatingBar', () => {
    it('should create action to toggle hide floating bar', () => {
      const action = toggleHideFloatingBar();
      expect(action.type).toBe(HIDE_FLOATING_BAR);
    });
  });
});
