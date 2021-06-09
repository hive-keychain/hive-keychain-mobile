import {
  ADD_TO_BROWSER_HISTORY,
  CLEAR_BROWSER_HISTORY,
  ADD_TO_BROWSER_FAVORITES,
  REMOVE_FROM_BROWSER_FAVORITES,
  ADD_BROWSER_TAB,
  CLOSE_BROWSER_TAB,
  UPDATE_BROWSER_TAB,
  CLOSE_ALL_BROWSER_TABS,
  SET_ACTIVE_BROWSER_TAB,
  BROWSER_FOCUS,
  UPDATE_MANAGEMENT,
} from './types';
import {navigate} from 'utils/navigation';
import {actionPayload, browserPayload, tab, history} from './interfaces';
import {AppThunk, useAppSelector} from 'src/hooks/redux';
import {AppDispatch, RootState} from 'store';

export const addToHistory = (history: history) => {
  const action: actionPayload<browserPayload> = {
    type: ADD_TO_BROWSER_HISTORY,
    payload: {history},
  };
  return action;
};

export const clearHistory = () => {
  const action: actionPayload<browserPayload> = {
    type: CLEAR_BROWSER_HISTORY,
  };
  return action;
};

export const addToFavorites = (url: string) => {
  const action: actionPayload<browserPayload> = {
    type: ADD_TO_BROWSER_FAVORITES,
    payload: {url},
  };
  return action;
};

export const removeFromFavorites = (url: string) => {
  const action: actionPayload<browserPayload> = {
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
  const action: actionPayload<browserPayload> = {
    type: BROWSER_FOCUS,
    payload: {shouldFocus},
  };
  return action;
};

export const addTab = (url: string) => {
  const action: actionPayload<browserPayload> = {
    type: ADD_BROWSER_TAB,
    payload: {url, id: Date.now()},
  };
  return action;
};

export const closeTab = (id: number) => {
  const action: actionPayload<browserPayload> = {
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

export const updateTab = (id: number, data: tab) => {
  const action: actionPayload<browserPayload> = {
    type: UPDATE_BROWSER_TAB,
    payload: {id, data},
  };
  return action;
};

export const showManagementScreen = (showManagement: boolean) => {
  const action: actionPayload<browserPayload> = {
    type: UPDATE_MANAGEMENT,
    payload: {showManagement},
  };
  return action;
};
