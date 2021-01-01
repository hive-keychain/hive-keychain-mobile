import {
  LOAD_TOKENS,
  LOAD_USER_TOKENS,
  LOAD_TOKENS_MARKET,
  LOAD_TOKEN_HISTORY,
  CLEAR_USER_TOKENS,
} from './types';
import hsc, {hiveEngineAPI} from 'api/hiveEngine';

export const loadTokens = () => async (dispatch) => {
  dispatch({
    type: LOAD_TOKENS,
    payload: await hsc.find('tokens', 'tokens', {}, 1000, 0, []),
  });
};

export const loadTokensMarket = () => async (dispatch) => {
  dispatch({
    type: LOAD_TOKENS_MARKET,
    payload: await hsc.find('market', 'metrics', {}, 1000, 0, []),
  });
};

export const loadUserTokens = (account) => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_USER_TOKENS,
    });
    const tokensBalance = (await hsc.find('tokens', 'balances', {account}))
      .filter((t) => parseFloat(t.balance) !== 0)
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
    dispatch({
      type: LOAD_USER_TOKENS,
      payload: tokensBalance,
    });
  } catch (e) {
    console.log(e);
  }
};

export const loadTokenHistory = (account, currency) => async (dispatch) => {
  const tokenHistory = (
    await hiveEngineAPI.get('accountHistory', {
      params: {account, symbol: currency, type: 'user'},
    })
  ).data.map((e) => {
    e.amount = `${e.quantity} ${e.symbol}`;
    return e;
  });
  dispatch({type: LOAD_TOKEN_HISTORY, payload: tokenHistory});
};
