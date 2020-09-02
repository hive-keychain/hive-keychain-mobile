import {combineReducers} from 'redux';
import authReducer from './authReducer';
import accountsReducer from './accountsReducer';
import hasAccountsReducer from './hasAccountsReducer';
import activeAccountReducer from './activeAccountReducer';
import globalPropertiesReducer from './globalPropertiesReducer';

export default combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
  hasAccounts: hasAccountsReducer,
  activeAccount: activeAccountReducer,
  properties: globalPropertiesReducer,
});
