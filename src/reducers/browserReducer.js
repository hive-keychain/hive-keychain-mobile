import {
  ADD_TO_BROWSER_HISTORY,
  ADD_TO_BROWSER_WHITELIST,
  CLEAR_BROWSER_HISTORY,
  CLOSE_ALL_BROWSER_TABS,
  CREATE_BROWSER_TAB,
  CLOSE_BROWSER_TAB,
  SET_ACTIVE_BROWSER_TAB,
  UPDATE_BROWSER_TAB,
} from 'actions/types';

const browserReducer = (
  state = {
    history: [],
    whitelist: [],
    tabs: [],
    activeTab: null,
  },
  {type, payload},
) => {
  switch (type) {
    case ADD_TO_BROWSER_HISTORY:
      return {
        ...state,
        history: [...state.history, {url: payload.url, name: payload.name}],
      };
    case ADD_TO_BROWSER_WHITELIST:
      return {
        ...state,
        whitelist: [...state.whitelist, payload.url],
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
    case CREATE_BROWSER_TAB:
      return {
        ...state,
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
    default:
      return state;
  }
};
export default browserReducer;
