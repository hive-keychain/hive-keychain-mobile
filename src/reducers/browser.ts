import {
  ActionPayload,
  Browser,
  BrowserPayload,
  Tab,
} from 'actions/interfaces';
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
import {translate} from 'utils/localize';

const MAX_TAB_NAVIGATION_HISTORY = 100;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const areEquivalentUrls = (a?: string, b?: string) => {
  if (!a || !b) return a === b;
  return a === b || `${a}/` === b || `${b}/` === a;
};

const findLastEquivalentIndex = (history: string[], url: string) => {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (areEquivalentUrls(history[i], url)) {
      return i;
    }
  }
  return -1;
};

const trimNavigationHistory = (
  navigationHistory: string[],
  navigationIndex: number,
) => {
  if (navigationHistory.length <= MAX_TAB_NAVIGATION_HISTORY) {
    return {navigationHistory, navigationIndex};
  }
  const amountToTrim = navigationHistory.length - MAX_TAB_NAVIGATION_HISTORY;
  return {
    navigationHistory: navigationHistory.slice(amountToTrim),
    navigationIndex: Math.max(0, navigationIndex - amountToTrim),
  };
};

const normalizeTabNavigation = (tab: Tab): Tab => {
  const fallbackUrl = tab.url || 'about:blank';
  const rawHistory =
    Array.isArray(tab.navigationHistory) && tab.navigationHistory.length
      ? tab.navigationHistory.filter(
          (entry): entry is string => typeof entry === 'string' && !!entry,
        )
      : [fallbackUrl];
  let navigationHistory = rawHistory.length ? rawHistory : [fallbackUrl];
  let navigationIndex =
    typeof tab.navigationIndex === 'number'
      ? tab.navigationIndex
      : navigationHistory.length - 1;
  navigationIndex = clamp(navigationIndex, 0, navigationHistory.length - 1);
  if (tab.url && !areEquivalentUrls(navigationHistory[navigationIndex], tab.url)) {
    const existingIndex = findLastEquivalentIndex(navigationHistory, tab.url);
    if (existingIndex !== -1) {
      navigationIndex = existingIndex;
    } else {
      navigationHistory = [
        ...navigationHistory.slice(0, navigationIndex + 1),
        tab.url,
      ];
      navigationIndex = navigationHistory.length - 1;
    }
  }
  const trimmed = trimNavigationHistory(navigationHistory, navigationIndex);
  navigationHistory = trimmed.navigationHistory;
  navigationIndex = trimmed.navigationIndex;
  return {
    ...tab,
    navigationHistory,
    navigationIndex,
    canGoBack: navigationIndex > 0,
    canGoForward: navigationIndex < navigationHistory.length - 1,
  };
};

const applyTabNavigation = (tab: Tab, nextUrl: string): Tab => {
  const normalizedTab = normalizeTabNavigation(tab);
  let navigationHistory = [...(normalizedTab.navigationHistory || [tab.url])];
  let navigationIndex = normalizedTab.navigationIndex || 0;
  const currentUrl = navigationHistory[navigationIndex];

  if (areEquivalentUrls(nextUrl, currentUrl)) {
    return {
      ...normalizedTab,
      url: nextUrl,
    };
  }

  if (
    navigationIndex > 0 &&
    areEquivalentUrls(navigationHistory[navigationIndex - 1], nextUrl)
  ) {
    navigationIndex -= 1;
  } else if (
    navigationIndex < navigationHistory.length - 1 &&
    areEquivalentUrls(navigationHistory[navigationIndex + 1], nextUrl)
  ) {
    navigationIndex += 1;
  } else {
    navigationHistory = navigationHistory.slice(0, navigationIndex + 1);
    if (
      !areEquivalentUrls(
        navigationHistory[navigationHistory.length - 1],
        nextUrl,
      )
    ) {
      navigationHistory.push(nextUrl);
    } else {
      navigationHistory[navigationHistory.length - 1] = nextUrl;
    }
    navigationIndex = navigationHistory.length - 1;
  }

  const trimmed = trimNavigationHistory(navigationHistory, navigationIndex);
  navigationHistory = trimmed.navigationHistory;
  navigationIndex = trimmed.navigationIndex;
  return {
    ...normalizedTab,
    url: nextUrl,
    navigationHistory,
    navigationIndex,
    canGoBack: navigationIndex > 0,
    canGoForward: navigationIndex < navigationHistory.length - 1,
  };
};

const browserReducer = (
  state: Browser = {
    history: [],
    favorites: [],
    tabs: [],
    activeTab: null,
    shouldFocus: false,
    showManagement: false,
  },
  {type, payload}: ActionPayload<BrowserPayload>,
) => {
  switch (type) {
    case ADD_TO_BROWSER_HISTORY:
      if (payload!.history!.url === 'about:blank') {
        return state;
      }
      const newFavorites = state.favorites.map((e) => {
        if (e.url === payload!.history!.url) {
          return payload!.history!;
        }
        return e;
      });
      return {
        ...state,
        history: [
          ...state.history.filter((e) => e!.url !== payload!.history!.url),
          payload!.history!,
        ],
        favorites: newFavorites,
      };
    case ADD_TO_BROWSER_FAVORITES: {
      const favoriteToAdd = payload!.favorite!;
      const existingIndex = state.favorites.findIndex(
        (fav) => fav.url === favoriteToAdd.url,
      );
      const favorites =
        existingIndex !== -1
          ? state.favorites.map((fav) =>
              fav.url === favoriteToAdd.url ? favoriteToAdd : fav,
            )
          : [...state.favorites, favoriteToAdd];
      return {
        ...state,
        favorites,
      };
    }
    case REMOVE_FROM_BROWSER_HISTORY:
      console.log('removeFromHistory reducer', payload.url);
      console.log(
        'state.history',
        state.history.filter((item) => item.url !== payload.url),
      );
      return {
        ...state,
        history: state.history.filter((item) => item.url !== payload.url),
      };
    case REMOVE_FROM_BROWSER_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.url !== payload.url),
      };
    case UPDATE_FAVORITES: {
      // ensure immutability and dedupe by url
      const seen: Record<string, boolean> = {};
      const favorites = payload!.favorites!.filter((fav) => {
        if (!fav || !fav.url) return false;
        if (seen[fav.url]) return false;
        seen[fav.url] = true;
        return true;
      });
      return {
        ...state,
        favorites,
      };
    }
    case CLEAR_BROWSER_HISTORY:
      return {
        ...state,
        history: [],
      };
    case CLOSE_ALL_BROWSER_TABS:
      return {
        ...state,
        tabs: [],
      };
    case ADD_BROWSER_TAB:
      if (payload!.id && payload!.url) {
        const tab = normalizeTabNavigation({
          url: payload!.url,
          id: payload!.id,
          icon: 'https://hive-keychain.com/img/logo.png',
          name: translate('browser.home.title'),
        });
        return {
          ...state,
          activeTab: payload!.id,
          showManagement: false,
          tabs: [...state.tabs, tab],
        };
      } else return state;
    case CLOSE_BROWSER_TAB:
      const tabs = state.tabs.filter((tab) => tab!.id !== payload!.id);
      return {
        ...state,
        tabs,
      };
    case SET_ACTIVE_BROWSER_TAB:
      return {
        ...state,
        activeTab: payload!.id!,
      };
    case UPDATE_BROWSER_TAB:
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab!.id === payload!.id) {
            const normalizedTab = normalizeTabNavigation(tab);
            const nextUrl = payload?.data?.url;
            const navigationAwareTab =
              nextUrl && nextUrl !== normalizedTab.url
                ? applyTabNavigation(normalizedTab, nextUrl)
                : normalizedTab;
            return {
              ...navigationAwareTab,
              ...payload!.data,
              navigationHistory: navigationAwareTab.navigationHistory,
              navigationIndex: navigationAwareTab.navigationIndex,
              canGoBack: navigationAwareTab.canGoBack,
              canGoForward: navigationAwareTab.canGoForward,
            };
          }
          return tab;
        }),
      };
    case BROWSER_FOCUS:
      return payload!.shouldFocus !== undefined
        ? {...state, shouldFocus: payload!.shouldFocus}
        : state;
    case UPDATE_MANAGEMENT:
      return payload!.showManagement !== undefined
        ? {...state, showManagement: payload!.showManagement}
        : state;
    default:
      if (state.favorites) return state;
      return {...state, favorites: []};
  }
};
export default browserReducer;
