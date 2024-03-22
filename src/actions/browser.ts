import {AppThunk} from 'src/hooks/redux';
import {EcosystemUtils} from 'utils/ecosystem.utils';
import {navigate} from 'utils/navigation';
import {ActionPayload, BrowserPayload, Page, TabFields} from './interfaces';
import {
  ADD_BROWSER_TAB,
  ADD_TO_BROWSER_FAVORITES,
  ADD_TO_BROWSER_HISTORY,
  BROWSER_FOCUS,
  CLEAR_BROWSER_HISTORY,
  CLOSE_ALL_BROWSER_TABS,
  CLOSE_BROWSER_TAB,
  GET_ECOSYSTEM,
  REMOVE_FROM_BROWSER_FAVORITES,
  SET_ACTIVE_BROWSER_TAB,
  UPDATE_BROWSER_TAB,
  UPDATE_MANAGEMENT,
} from './types';

export const addToHistory = (history: Page) => {
  const action: ActionPayload<BrowserPayload> = {
    type: ADD_TO_BROWSER_HISTORY,
    payload: {history},
  };
  return action;
};

export const clearHistory = () => {
  const action: ActionPayload<BrowserPayload> = {
    type: CLEAR_BROWSER_HISTORY,
  };
  return action;
};

export const addToFavorites = (page: Page) => {
  const action: ActionPayload<BrowserPayload> = {
    type: ADD_TO_BROWSER_FAVORITES,
    payload: {favorite: page},
  };
  return action;
};

export const removeFromFavorites = (url: string) => {
  const action: ActionPayload<BrowserPayload> = {
    type: REMOVE_FROM_BROWSER_FAVORITES,
    payload: {url},
  };
  return action;
};

export const addTabFromLinking = (url: string): AppThunk => (
  dispatch,
  getState,
) => {
  const existingTab = getState().browser.tabs.find((t) => t.url === url);
  if (existingTab) {
    dispatch(changeTab(existingTab.id));
  } else {
    const id = Date.now();
    dispatch({
      type: ADD_BROWSER_TAB,
      payload: {url, id},
    });
    dispatch(changeTab(id));
  }
  dispatch(showManagementScreen(false));
  if (getState().auth.mk) {
    navigate('BrowserScreen');
  } else {
    dispatch(setBrowserFocus(true));
  }
};

export const setBrowserFocus = (shouldFocus: boolean) => {
  const action: ActionPayload<BrowserPayload> = {
    type: BROWSER_FOCUS,
    payload: {shouldFocus},
  };
  return action;
};

export const addTab = (url: string) => {
  const action: ActionPayload<BrowserPayload> = {
    type: ADD_BROWSER_TAB,
    payload: {url, id: Date.now()},
  };
  return action;
};

export const closeTab = (id: number) => {
  const action: ActionPayload<BrowserPayload> = {
    type: CLOSE_BROWSER_TAB,
    payload: {id},
  };
  return action;
};

export const closeAllTabs = () => {
  return {
    type: CLOSE_ALL_BROWSER_TABS,
  };
};

export const changeTab = (id: number) => {
  return {
    type: SET_ACTIVE_BROWSER_TAB,
    payload: {id},
  };
};

export const updateTab = (id: number, data: TabFields) => {
  const action: ActionPayload<BrowserPayload> = {
    type: UPDATE_BROWSER_TAB,
    payload: {id, data},
  };
  return action;
};

export const showManagementScreen = (showManagement: boolean) => {
  const action: ActionPayload<BrowserPayload> = {
    type: UPDATE_MANAGEMENT,
    payload: {showManagement},
  };
  return action;
};

export const getEcosystem = (chain: string): AppThunk => async (dispatch) => {
  const eco = await EcosystemUtils.getDappList(chain);
  dispatch({
    type: GET_ECOSYSTEM,
    payload: eco,
  });
};
