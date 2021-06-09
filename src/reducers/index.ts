import {combineReducers} from 'redux';
import auth from './auth';
import accounts from './accounts';
import lastAccount from './lastAccount';
import activeAccount from './activeAccount';
import properties from './globalProperties';
import bittrex from './bittrex';
import transactions from './transactions';
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
  accounts,
  lastAccount,
  activeAccount,
  properties,
  bittrex,
  transactions,
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
