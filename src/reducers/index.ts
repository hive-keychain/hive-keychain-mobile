import {combineReducers} from 'redux';
import accountValueDisplay from './accountValueDisplay';
import accounts from './accounts';
import activeAccount from './activeAccount';
import auth from './auth';
import browser from './browser';
import colors from './colors';
import conversions from './conversions';
import currencyPrices from './currencyPrices';
import delegations from './delegations';
import ecosystem from './ecosystem';
import floatingBar from './floatingBar';
import properties from './globalProperties';
import historyFilters from './historyFilters';
import hiveUri from './hive-uri';
import hive_authentication_service from './hiveAuthenticationService';
import lastAccount from './lastAccount';
import message from './message';
import navigation from './navigation';
import phishingAccounts from './phishing';
import preferences from './preferences';
import rpcSwitcher from './rpcSwitcher';
import settings from './settings';
import tokenHistory from './tokenHistory';
import tokens from './tokens';
import tokensFilters from './tokensFilters';
import tokensMarket from './tokensMarket';
import transactions from './transactions';
import userTokens from './userTokens';

export default combineReducers({
  auth,
  accounts,
  lastAccount,
  activeAccount,
  properties,
  currencyPrices,
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
  hive_authentication_service,
  hiveUri,
  historyFilters,
  tokensFilters,
  message,
  floatingBar,
  rpcSwitcher,
  accountValueDisplay,
  ecosystem,
  colors,
  navigation,
});
