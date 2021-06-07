import {
  ADD_TO_BROWSER_HISTORY,
  ADD_TO_BROWSER_FAVORITES,
  CLEAR_BROWSER_HISTORY,
  CLOSE_ALL_BROWSER_TABS,
  ADD_BROWSER_TAB,
  CLOSE_BROWSER_TAB,
  SET_ACTIVE_BROWSER_TAB,
  UPDATE_BROWSER_TAB,
  REMOVE_FROM_BROWSER_FAVORITES,
  BROWSER_FOCUS,
  UPDATE_MANAGEMENT,
} from 'actions/types';

const browserReducer = (
  state = {
    history: [],
    whitelist: [],
    tabs: [],
    activeTab: null,
    shouldFocus: false,
    showManagement: false,
  },
  {type, payload},
) => {
  switch (type) {
    case ADD_TO_BROWSER_HISTORY:
      if (state.history.find((e) => e.url === payload.url)) {
        return state;
      }
      return {
        ...state,
        history: [...state.history, payload],
      };
    case ADD_TO_BROWSER_FAVORITES:
      return {
        ...state,
        whitelist: [...state.whitelist, payload.url],
      };
    case REMOVE_FROM_BROWSER_FAVORITES:
      return {
        ...state,
        whitelist: state.whitelist.filter((item) => item !== payload.id),
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
      return {
        ...state,
        activeTab: payload.id,
        tabs: [...state.tabs, {url: payload.url, id: payload.id}],
      };
    case CLOSE_BROWSER_TAB:
      return {
        ...state,
        tabs: state.tabs.filter((tab) => tab.id !== payload.id),
      };
    case SET_ACTIVE_BROWSER_TAB:
      return {
        ...state,
        activeTab: payload.id,
      };
    case UPDATE_BROWSER_TAB:
      return {
        ...state,
        tabs: state.tabs.map((tab) => {
          if (tab.id === payload.id) {
            return {...tab, ...payload.data};
          }
          return {...tab};
        }),
      };
    case BROWSER_FOCUS:
      return {...state, shouldFocus: payload};
    case UPDATE_MANAGEMENT:
      return {...state, showManagement: payload};
    default:
      return state;
  }
};
export default browserReducer;
