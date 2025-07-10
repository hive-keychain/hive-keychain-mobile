import {ActionPayload, Browser, BrowserPayload} from 'actions/interfaces';
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
    case ADD_TO_BROWSER_FAVORITES:
      const newFavorite = state.favorites;
      newFavorite.push(payload!.favorite);
      return {
        ...state,
        favorites: newFavorite,
      };
    case REMOVE_FROM_BROWSER_HISTORY:
      return {
        ...state,
        history: state.history.filter((item) => item.url !== payload.url),
      };
    case REMOVE_FROM_BROWSER_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.url !== payload.url),
      };
    case UPDATE_FAVORITES:
      return {
        ...state,
        favorites: payload!.favorites!,
      };
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
        return {
          ...state,
          activeTab: payload!.id,
          showManagement: false,
          tabs: [
            ...state.tabs,
            {
              url: payload!.url,
              id: payload!.id,
              icon: 'https://hive-keychain.com/img/logo.png',
              name: translate('browser.home.title'),
            },
          ],
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
            return {...tab, ...payload!.data};
          }
          return {...tab};
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
