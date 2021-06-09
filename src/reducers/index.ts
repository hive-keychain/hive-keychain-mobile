import {combineReducers} from 'redux';
import auth from './auth';
import accountsReducer from './accountsReducer';
import lastAccount from './lastAccount';
import activeAccountReducer from './activeAccountReducer';
import globalPropertiesReducer from './globalPropertiesReducer';
import bittrex from './bittrex';
import transactionsReducer from './transactions';
import delegations from './delegations';
import tokens from './tokens';
import userTokens from './userTokens';
import tokensMarket from './tokensMarket';
import tokenHistory from './tokenHistory';
import phishingAccounts from './phishing';
import conversions from './conversions';
import settings from './settings';
import browser from './browser';

export default combineReducers({
  auth,
  accounts: accountsReducer,
  lastAccount,
  activeAccount: activeAccountReducer,
  properties: globalPropertiesReducer,
  bittrex,
  transactions: transactionsReducer,
  delegations,
  tokens,
  userTokens,
  tokensMarket,
  tokenHistory,
  phishingAccounts,
  conversions,
  settings,
  browser,
});
