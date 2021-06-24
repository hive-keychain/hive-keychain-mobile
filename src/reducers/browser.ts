import {ActionPayload, Browser, BrowserPayload} from 'actions/interfaces';
import {
  ADD_BROWSER_TAB,
  ADD_TO_BROWSER_HISTORY,
  BROWSER_FOCUS,
  CLEAR_BROWSER_HISTORY,
  CLOSE_ALL_BROWSER_TABS,
  CLOSE_BROWSER_TAB,
  SET_ACTIVE_BROWSER_TAB,
  UPDATE_BROWSER_TAB,
  UPDATE_MANAGEMENT,
} from 'actions/types';

const browserReducer = (
  state: Browser = {
    history: [],
    whitelist: [],
    tabs: [],
    activeTab: null,
    shouldFocus: false,
    showManagement: false,
  },
  {type, payload}: ActionPayload<BrowserPayload>,
) => {
  switch (type) {
    case ADD_TO_BROWSER_HISTORY:
      if (state.history.find((e) => e!.url === payload!.history!.url)) {
        return state;
      }
      return {
        ...state,
        history: [...state.history, payload!.history!],
      };
    // case ADD_TO_BROWSER_FAVORITES:
    //   const newFavorite = state.whitelist;
    //   newFavorite.push(payload!.whitelist);
    //   return {
    //     ...state,
    //     whitelist: newFavorite,
    //   };
    // case REMOVE_FROM_BROWSER_FAVORITES:
    //   return {
    //     ...state,
    //     whitelist: state.whitelist.filter((item) => item !== payload.id),
    //   };
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
          tabs: [...state.tabs, {url: payload!.url, id: payload!.id}],
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
      return state;
  }
};
export default browserReducer;
