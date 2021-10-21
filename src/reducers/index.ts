import {combineReducers} from 'redux';
import accounts from './accounts';
import activeAccount from './activeAccount';
import auth from './auth';
import bittrex from './bittrex';
import browser from './browser';
import conversions from './conversions';
import delegations from './delegations';
import properties from './globalProperties';
import HAS_Init from './HAS/requestInitialization';
import lastAccount from './lastAccount';
import phishingAccounts from './phishing';
import preferences from './preferences';
import settings from './settings';
import tokenHistory from './tokenHistory';
import tokens from './tokens';
import tokensMarket from './tokensMarket';
import transactions from './transactions';
import userTokens from './userTokens';
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
  preferences,
  HAS_Init,
});
