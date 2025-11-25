import {
  addTab,
  addTabFromLinking,
  addToFavorites,
  addToHistory,
  changeTab,
  clearHistory,
  closeAllTabs,
  closeTab,
  getEcosystem,
  removeFromFavorites,
  removeFromHistory,
  setBrowserFocus,
  showManagementScreen,
  updateFavorites,
  updateTab,
} from '../browser';
import {Page} from '../interfaces';
import {
  ADD_BROWSER_TAB,
  ADD_TO_BROWSER_FAVORITES,
  ADD_TO_BROWSER_HISTORY,
  BROWSER_FOCUS,
  CLEAR_BROWSER_HISTORY,
  CLOSE_ALL_BROWSER_TABS,
  CLOSE_BROWSER_TAB,
  REMOVE_FROM_BROWSER_FAVORITES,
  REMOVE_FROM_BROWSER_HISTORY,
  SET_ACTIVE_BROWSER_TAB,
  UPDATE_BROWSER_TAB,
  UPDATE_FAVORITES,
  UPDATE_MANAGEMENT,
} from '../types';

jest.mock('utils/ecosystem.utils', () => ({
  EcosystemUtils: {
    getDappList: jest.fn(),
  },
}));

jest.mock('utils/navigation.utils', () => ({
  navigate: jest.fn(),
}));

describe('browser actions', () => {
  describe('addToHistory', () => {
    it('should create action to add page to history', () => {
      const page: Page = {url: 'https://example.com', name: 'Example'};
      const action = addToHistory(page);
      expect(action.type).toBe(ADD_TO_BROWSER_HISTORY);
      expect(action.payload?.history).toEqual(page);
    });
  });

  describe('removeFromHistory', () => {
    it('should create action to remove page from history', () => {
      const url = 'https://example.com';
      const action = removeFromHistory(url);
      expect(action.type).toBe(REMOVE_FROM_BROWSER_HISTORY);
      expect(action.payload?.url).toBe(url);
    });
  });

  describe('clearHistory', () => {
    it('should create action to clear history', () => {
      const action = clearHistory();
      expect(action.type).toBe(CLEAR_BROWSER_HISTORY);
    });
  });

  describe('addToFavorites', () => {
    it('should create action to add page to favorites', () => {
      const page: Page = {url: 'https://example.com', name: 'Example'};
      const action = addToFavorites(page);
      expect(action.type).toBe(ADD_TO_BROWSER_FAVORITES);
      expect(action.payload?.favorite).toEqual(page);
    });
  });

  describe('updateFavorites', () => {
    it('should create action to update favorites', () => {
      const favorites: Page[] = [{url: 'https://example.com', name: 'Example'}];
      const action = updateFavorites(favorites);
      expect(action.type).toBe(UPDATE_FAVORITES);
      expect(action.payload?.favorites).toEqual(favorites);
    });
  });

  describe('removeFromFavorites', () => {
    it('should create action to remove page from favorites', () => {
      const url = 'https://example.com';
      const action = removeFromFavorites(url);
      expect(action.type).toBe(REMOVE_FROM_BROWSER_FAVORITES);
      expect(action.payload?.url).toBe(url);
    });
  });

  describe('setBrowserFocus', () => {
    it('should create action to set browser focus', () => {
      const action = setBrowserFocus(true);
      expect(action.type).toBe(BROWSER_FOCUS);
      expect(action.payload?.shouldFocus).toBe(true);
    });

    it('should handle false focus', () => {
      const action = setBrowserFocus(false);
      expect(action.payload?.shouldFocus).toBe(false);
    });
  });

  describe('addTab', () => {
    it('should create action to add tab', () => {
      const url = 'https://example.com';
      const action = addTab(url);
      expect(action.type).toBe(ADD_BROWSER_TAB);
      expect(action.payload?.url).toBe(url);
      expect(action.payload?.id).toBeDefined();
    });
  });

  describe('closeTab', () => {
    it('should create action to close tab', () => {
      const id = 123;
      const action = closeTab(id);
      expect(action.type).toBe(CLOSE_BROWSER_TAB);
      expect(action.payload?.id).toBe(id);
    });
  });

  describe('closeAllTabs', () => {
    it('should create action to close all tabs', () => {
      const action = closeAllTabs();
      expect(action.type).toBe(CLOSE_ALL_BROWSER_TABS);
    });
  });

  describe('changeTab', () => {
    it('should create action to change active tab', () => {
      const id = 123;
      const action = changeTab(id);
      expect(action.type).toBe(SET_ACTIVE_BROWSER_TAB);
      expect(action.payload?.id).toBe(id);
    });
  });

  describe('updateTab', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create action to update tab', () => {
      const id = 123;
      const data = {name: 'Updated Tab'};
      const action = updateTab(id, data);
      expect(action.type).toBe(UPDATE_BROWSER_TAB);
      expect(action.payload?.id).toBe(id);
      expect(action.payload?.data).toEqual(data);
    });

    it('should abort update when stalled', () => {
      const id = 123;
      const data = {name: 'Tab'};
      updateTab(id, data, true);
      const action = updateTab(id, data, false);
      expect(action.type).toBe('ABORTED');
      jest.advanceTimersByTime(1000);
      const actionAfter = updateTab(id, data, false);
      expect(actionAfter.type).toBe(UPDATE_BROWSER_TAB);
    });
  });

  describe('showManagementScreen', () => {
    it('should create action to show management screen', () => {
      const action = showManagementScreen(true);
      expect(action.type).toBe(UPDATE_MANAGEMENT);
      expect(action.payload?.showManagement).toBe(true);
    });

    it('should handle hiding management screen', () => {
      const action = showManagementScreen(false);
      expect(action.payload?.showManagement).toBe(false);
    });
  });

  describe('addTabFromLinking', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should switch to existing tab if url already exists', () => {
      const mockGetState = jest.fn(() => ({
        browser: {
          tabs: [{id: 1, url: 'https://example.com'}] as any[],
        },
        auth: {mk: 'masterkey'},
      })) as any;
      const thunk = addTabFromLinking('https://example.com');
      thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalledWith(changeTab(1));
      expect(mockDispatch).toHaveBeenCalledWith(showManagementScreen(false));
    });

    it('should create new tab if url does not exist', () => {
      const mockGetState = jest.fn(() => ({
        browser: {
          tabs: [] as any[],
        },
        auth: {mk: 'masterkey'},
      })) as any;
      const thunk = addTabFromLinking('https://example.com');
      thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ADD_BROWSER_TAB,
          payload: expect.objectContaining({url: 'https://example.com'}),
        }),
      );
      expect(mockDispatch).toHaveBeenCalledWith(showManagementScreen(false));
    });

    it('should navigate to Browser when mk exists', () => {
      const {navigate} = require('utils/navigation.utils');
      const mockGetState = jest.fn(() => ({
        browser: {
          tabs: [] as any[],
        },
        auth: {mk: 'masterkey'},
      })) as any;
      const thunk = addTabFromLinking('https://example.com');
      thunk(mockDispatch, mockGetState, undefined);
      expect(navigate).toHaveBeenCalledWith('Browser');
    });

    it('should set browser focus when mk does not exist', () => {
      const mockGetState = jest.fn(() => ({
        browser: {
          tabs: [] as any[],
        },
        auth: {mk: null as any},
      })) as any;
      const thunk = addTabFromLinking('https://example.com');
      thunk(mockDispatch, mockGetState, undefined);
      expect(mockDispatch).toHaveBeenCalledWith(setBrowserFocus(true));
    });
  });

  describe('getEcosystem', () => {
    it('should fetch ecosystem and dispatch action', async () => {
      const {EcosystemUtils} = require('utils/ecosystem.utils');
      const mockEcosystem = [{name: 'DApp1', url: 'https://dapp1.com'}];
      (EcosystemUtils.getDappList as jest.Mock).mockResolvedValueOnce(
        mockEcosystem,
      );
      const mockDispatch = jest.fn();
      const mockGetState = jest.fn();
      const thunk = getEcosystem('hive');
      await thunk(mockDispatch, mockGetState, undefined);
      expect(EcosystemUtils.getDappList).toHaveBeenCalledWith('hive');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'GET_ECOSYSTEM',
        payload: mockEcosystem,
      });
    });
  });
});
