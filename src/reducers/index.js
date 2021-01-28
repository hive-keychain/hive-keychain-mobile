import {combineReducers} from 'redux';
import authReducer from './authReducer';
import accountsReducer from './accountsReducer';
import lastAccountsReducer from './lastAccountsReducer';
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
import settingsReducer from './settingsReducer';

export default combineReducers({
  auth: authReducer,
  accounts: accountsReducer,
  lastAccount: lastAccountsReducer,
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
  settings: settingsReducer,
});
