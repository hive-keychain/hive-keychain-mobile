import {
  ADD_TO_BROWSER_HISTORY,
  CLEAR_BROWSER_HISTORY,
  ADD_TO_BROWSER_WHITELIST,
  REMOVE_FROM_BROWSER_WHITELIST,
  CREATE_BROWSER_TAB,
  CLOSE_BROWSER_TAB,
  UPDATE_BROWSER_TAB,
  CLOSE_ALL_BROWSER_TABS,
  SET_ACTIVE_BROWSER_TAB,
} from './types';

export function addToBrowserHistory({url, name}) {
  return {
    type: ADD_TO_BROWSER_HISTORY,
    payload: {url, name},
  };
}

export function clearHistory() {
  return {
    type: CLEAR_BROWSER_HISTORY,
  };
}

export function addToBrowserWhitelist(url) {
  return {
    type: ADD_TO_BROWSER_WHITELIST,
    payload: {url},
  };
}

export function removeFromBrowserWhitelist(url) {
  return {
    type: REMOVE_FROM_BROWSER_WHITELIST,
    payload: {url},
  };
}

export function createBrowserTab(url) {
  return {
    type: CREATE_BROWSER_TAB,
    payload: {url, id: Date.now()},
  };
}

export function closeBrowserTab(id) {
  return {
    type: CLOSE_BROWSER_TAB,
    payload: {id},
  };
}

export function closeAllBrowserTabs() {
  return {
    type: CLOSE_ALL_BROWSER_TABS,
  };
}

export function setActiveBrowserTab(id) {
  return {
    type: SET_ACTIVE_BROWSER_TAB,
    payload: {id},
  };
}

export function updateBrowserTab(id, data) {
  return {
    type: UPDATE_BROWSER_TAB,
    payload: {id, data},
  };
}
