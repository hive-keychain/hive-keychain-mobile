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
} from 'actions/types';
import browserReducer from '../browser';

describe('browser reducer', () => {
  const initialState = {
    history: [],
    favorites: [],
    tabs: [],
    activeTab: null,
    shouldFocus: false,
    showManagement: false,
  };

  it('should return initial state', () => {
    expect(browserReducer(undefined, {type: 'UNKNOWN'})).toEqual(initialState);
  });

  it('should handle ADD_TO_BROWSER_HISTORY', () => {
    const historyItem = {url: 'https://example.com', name: 'Example'};
    const action = {
      type: ADD_TO_BROWSER_HISTORY,
      payload: {history: historyItem},
    };
    const result = browserReducer(initialState, action);
    expect(result.history).toContainEqual(historyItem);
  });

  it('should not add about:blank to history', () => {
    const action = {
      type: ADD_TO_BROWSER_HISTORY,
      payload: {history: {url: 'about:blank', name: 'Blank'}},
    };
    const result = browserReducer(initialState, action);
    expect(result.history).not.toContainEqual({url: 'about:blank'});
  });

  it('should handle ADD_TO_BROWSER_FAVORITES', () => {
    const favorite = {url: 'https://example.com', name: 'Example'};
    const action = {
      type: ADD_TO_BROWSER_FAVORITES,
      payload: {favorite},
    };
    const result = browserReducer(initialState, action);
    expect(result.favorites).toContainEqual(favorite);
  });

  it('should update existing favorite', () => {
    const state = {
      ...initialState,
      favorites: [{url: 'https://example.com', name: 'Old'}],
    };
    const favorite = {url: 'https://example.com', name: 'New'};
    const action = {
      type: ADD_TO_BROWSER_FAVORITES,
      payload: {favorite},
    };
    const result = browserReducer(state, action);
    expect(result.favorites[0].name).toBe('New');
  });

  it('should handle REMOVE_FROM_BROWSER_HISTORY', () => {
    const state = {
      ...initialState,
      history: [{url: 'https://example.com', name: 'Example'}],
    };
    const action = {
      type: REMOVE_FROM_BROWSER_HISTORY,
      payload: {url: 'https://example.com'},
    };
    const result = browserReducer(state, action);
    expect(result.history).toHaveLength(0);
  });

  it('should handle REMOVE_FROM_BROWSER_FAVORITES', () => {
    const state = {
      ...initialState,
      favorites: [{url: 'https://example.com', name: 'Example'}],
    };
    const action = {
      type: REMOVE_FROM_BROWSER_FAVORITES,
      payload: {url: 'https://example.com'},
    };
    const result = browserReducer(state, action);
    expect(result.favorites).toHaveLength(0);
  });

  it('should handle CLEAR_BROWSER_HISTORY', () => {
    const state = {
      ...initialState,
      history: [{url: 'https://example.com', name: 'Example'}],
    };
    const action = {
      type: CLEAR_BROWSER_HISTORY,
      payload: {},
    };
    const result = browserReducer(state, action);
    expect(result.history).toHaveLength(0);
  });

  it('should handle ADD_BROWSER_TAB', () => {
    const action = {
      type: ADD_BROWSER_TAB,
      payload: {id: 'tab1', url: 'https://example.com'},
    };
    const result = browserReducer(initialState, action);
    expect(result.tabs).toHaveLength(1);
    expect(result.activeTab).toBe('tab1');
  });

  it('should not add tab without id or url', () => {
    const action = {
      type: ADD_BROWSER_TAB,
      payload: {},
    };
    const result = browserReducer(initialState, action);
    expect(result.tabs).toHaveLength(0);
  });

  it('should handle CLOSE_BROWSER_TAB', () => {
    const state = {
      ...initialState,
      tabs: [{id: 'tab1', url: 'https://example.com'}],
    };
    const action = {
      type: CLOSE_BROWSER_TAB,
      payload: {id: 'tab1'},
    };
    const result = browserReducer(state, action);
    expect(result.tabs).toHaveLength(0);
  });

  it('should handle SET_ACTIVE_BROWSER_TAB', () => {
    const action = {
      type: SET_ACTIVE_BROWSER_TAB,
      payload: {id: 'tab1'},
    };
    const result = browserReducer(initialState, action);
    expect(result.activeTab).toBe('tab1');
  });

  it('should handle UPDATE_BROWSER_TAB', () => {
    const state = {
      ...initialState,
      tabs: [{id: 'tab1', url: 'https://example.com', name: 'Old'}],
    };
    const action = {
      type: UPDATE_BROWSER_TAB,
      payload: {id: 'tab1', data: {name: 'New'}},
    };
    const result = browserReducer(state, action);
    expect(result.tabs[0].name).toBe('New');
  });

  it('should handle BROWSER_FOCUS', () => {
    const action = {
      type: BROWSER_FOCUS,
      payload: {shouldFocus: true},
    };
    const result = browserReducer(initialState, action);
    expect(result.shouldFocus).toBe(true);
  });

  it('should handle UPDATE_MANAGEMENT', () => {
    const action = {
      type: UPDATE_MANAGEMENT,
      payload: {showManagement: true},
    };
    const result = browserReducer(initialState, action);
    expect(result.showManagement).toBe(true);
  });

  it('should update favorite when adding matching URL to history', () => {
    const state = {
      ...initialState,
      favorites: [{url: 'https://example.com', name: 'Old Name'}],
    };
    const historyItem = {url: 'https://example.com', name: 'New Name'};
    const action = {
      type: ADD_TO_BROWSER_HISTORY,
      payload: {history: historyItem},
    };
    const result = browserReducer(state, action);
    expect(result.favorites[0].name).toBe('New Name');
  });

  it('should remove duplicate URLs from history when adding', () => {
    const state = {
      ...initialState,
      history: [{url: 'https://example.com', name: 'Old'}],
    };
    const historyItem = {url: 'https://example.com', name: 'New'};
    const action = {
      type: ADD_TO_BROWSER_HISTORY,
      payload: {history: historyItem},
    };
    const result = browserReducer(state, action);
    expect(result.history).toHaveLength(1);
    expect(result.history[0].name).toBe('New');
  });

  it('should handle UPDATE_FAVORITES', () => {
    const favorites = [
      {url: 'https://example.com', name: 'Example'},
      {url: 'https://test.com', name: 'Test'},
    ];
    const action = {
      type: UPDATE_FAVORITES,
      payload: {favorites},
    };
    const result = browserReducer(initialState, action);
    expect(result.favorites).toEqual(favorites);
  });

  it('should deduplicate favorites by URL in UPDATE_FAVORITES', () => {
    const favorites = [
      {url: 'https://example.com', name: 'Example1'},
      {url: 'https://example.com', name: 'Example2'},
      {url: 'https://test.com', name: 'Test'},
    ];
    const action = {
      type: UPDATE_FAVORITES,
      payload: {favorites},
    };
    const result = browserReducer(initialState, action);
    expect(result.favorites).toHaveLength(2);
    expect(result.favorites[0].name).toBe('Example1');
  });

  it('should filter out invalid favorites in UPDATE_FAVORITES', () => {
    const favorites = [
      {url: 'https://example.com', name: 'Example'},
      null as any,
      {name: 'No URL'},
      {url: '', name: 'Empty URL'},
    ];
    const action = {
      type: UPDATE_FAVORITES,
      payload: {favorites},
    };
    const result = browserReducer(initialState, action);
    expect(result.favorites).toHaveLength(1);
    expect(result.favorites[0].url).toBe('https://example.com');
  });

  it('should handle CLOSE_ALL_BROWSER_TABS', () => {
    const state = {
      ...initialState,
      tabs: [
        {id: 'tab1', url: 'https://example.com'},
        {id: 'tab2', url: 'https://test.com'},
      ],
    };
    const action = {
      type: CLOSE_ALL_BROWSER_TABS,
      payload: {},
    };
    const result = browserReducer(state, action);
    expect(result.tabs).toHaveLength(0);
  });

  it('should handle UPDATE_BROWSER_TAB when tab does not match', () => {
    const state = {
      ...initialState,
      tabs: [{id: 'tab1', url: 'https://example.com', name: 'Example'}],
    };
    const action = {
      type: UPDATE_BROWSER_TAB,
      payload: {id: 'tab2', data: {name: 'New'}},
    };
    const result = browserReducer(state, action);
    expect(result.tabs[0].name).toBe('Example');
  });

  it('should handle BROWSER_FOCUS with undefined shouldFocus', () => {
    const action = {
      type: BROWSER_FOCUS,
      payload: {},
    };
    const result = browserReducer(initialState, action);
    expect(result.shouldFocus).toBe(false);
  });

  it('should handle UPDATE_MANAGEMENT with undefined showManagement', () => {
    const action = {
      type: UPDATE_MANAGEMENT,
      payload: {},
    };
    const result = browserReducer(initialState, action);
    expect(result.showManagement).toBe(false);
  });

  it('should handle default case when favorites does not exist', () => {
    const stateWithoutFavorites = {
      history: [],
      tabs: [],
      activeTab: null,
      shouldFocus: false,
      showManagement: false,
    } as any;
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };
    const result = browserReducer(stateWithoutFavorites, action);
    expect(result.favorites).toEqual([]);
  });
});
