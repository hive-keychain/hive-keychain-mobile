import {combineReducers} from 'redux';
import auth from './auth';
import accountsReducer from './accountsReducer';
import lastAccount from './lastAccount';
import activeAccountReducer from './activeAccountReducer';
import globalPropertiesReducer from './globalPropertiesReducer';
import bittrexReducer from './bittrexReducer';
import transactionsReducer from './transactions';
import delegationsReducer from './delegationsReducer';
import tokensReducer from './tokensReducer';
import userTokensReducer from './userTokensReducer';
import tokensMarketReducer from './tokensMarketReducer';
import tokenHistoryReducer from './tokenHistoryReducer';
import phishingAccounts from './phishing';
import conversionsReducer from './conversionsReducer';
import settings from './settings';
import browser from './browser';

export default combineReducers({
  auth,
  accounts: accountsReducer,
  lastAccount,
  activeAccount: activeAccountReducer,
  properties: globalPropertiesReducer,
  bittrex: bittrexReducer,
  transactions: transactionsReducer,
  delegations: delegationsReducer,
  tokens: tokensReducer,
  userTokens: userTokensReducer,
  tokensMarket: tokensMarketReducer,
  tokenHistory: tokenHistoryReducer,
  phishingAccounts,
  conversions: conversionsReducer,
  settings,
  browser,
});
