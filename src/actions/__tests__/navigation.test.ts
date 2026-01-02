import {updateNavigationActiveScreen} from '../navigation';
import {UPDATE_NAVIGATION_SCREEN} from '../types';
import {BottomBarLink} from 'src/enums/bottomBarLink.enum';

describe('navigation actions', () => {
  describe('updateNavigationActiveScreen', () => {
    it('should create action to update active screen', () => {
      const screen = BottomBarLink.Browser;
      const action = updateNavigationActiveScreen(screen);
      expect(action.type).toBe(UPDATE_NAVIGATION_SCREEN);
      expect(action.payload).toBe(screen);
    });

    it('should handle different screen values', () => {
      const screen = BottomBarLink.Wallet;
      const action = updateNavigationActiveScreen(screen);
      expect(action.payload).toBe(screen);
    });

    it('should handle custom screen strings', () => {
      const screen = 'CustomScreen';
      const action = updateNavigationActiveScreen(screen);
      expect(action.payload).toBe(screen);
    });
  });
});


















