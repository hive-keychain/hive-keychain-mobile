import {combineReducers} from 'redux';
import authReducer from './authReducer';
import accountsReducer from './accountsReducer';
import hasAccountsReducer from './hasAccountsReducer';

export default combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
  hasAccounts: hasAccountsReducer,
});
