import {combineReducers} from 'redux';
import authReducer from './authReducer';
import accountsReducer from './accountsReducer';
import accountsEncryptedReducer from './accountsEncryptedReducer';

export default combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
  accountsEncrypted: accountsEncryptedReducer,
});
