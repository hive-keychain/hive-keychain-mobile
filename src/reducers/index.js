import {combineReducers} from 'redux';
import authReducer from './authReducer';
import accountsReducer from './accountsReducer';

export default combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
});
