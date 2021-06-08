import {combineReducers} from 'redux';
import auth from './auth';
import accountsReducer from './accountsReducer';
import lastAccount from './lastAccount';
import activeAccountReducer from './activeAccountReducer';
import globalPropertiesReducer from './globalPropertiesReducer';
import bittrexReducer from './bittrexReducer';
import transactionsReducer from './transactionsReducer';
import delegationsReducer from './delegationsReducer';
import tokensReducer from './tokensReducer';
import userTokensReducer from './userTokensReducer';
import tokensMarketReducer from './tokensMarketReducer';
import tokenHistoryReducer from './tokenHistoryReducer';
import phishingReducer from './phishingReducer';
import conversionsReducer from './conversionsReducer';
import settings from './settings';
import browserReducer from './browserReducer';

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
  phishingAccounts: phishingReducer,
  conversions: conversionsReducer,
  settings,
  browser: browserReducer,
});
