import {
  LOAD_TOKENS,
  LOAD_USER_TOKENS,
  LOAD_TOKENS_MARKET,
  LOAD_TOKEN_HISTORY,
  CLEAR_USER_TOKENS,
} from './types';
import hsc, {hiveEngineAPI} from 'api/hiveEngine';
import {AppThunk} from 'src/hooks/redux';
import {
  actionPayload,
  token,
  tokenBalance,
  tokenMarket,
  tokenTransaction,
} from './interfaces';

export const loadTokens = (): AppThunk => async (dispatch) => {
  const action: actionPayload<token[]> = {
    type: LOAD_TOKENS,
    payload: await hsc.find('tokens', 'tokens', {}, 1000, 0, []),
  };
  dispatch(action);
};

export const loadTokensMarket = (): AppThunk => async (dispatch) => {
  const action: actionPayload<tokenMarket[]> = {
    type: LOAD_TOKENS_MARKET,
    payload: await hsc.find('market', 'metrics', {}, 1000, 0, []),
  };
  dispatch(action);
};

export const loadUserTokens = (account: string): AppThunk => async (
  dispatch,
) => {
  try {
    dispatch({
      type: CLEAR_USER_TOKENS,
    });
    let tokensBalance: tokenBalance[] = await hsc.find('tokens', 'balances', {
      account,
    });
    tokensBalance = tokensBalance
      .filter((t) => parseFloat(t.balance) !== 0)
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
    const action: actionPayload<tokenBalance[]> = {
      type: LOAD_USER_TOKENS,
      payload: tokensBalance,
    };
    dispatch(action);
  } catch (e) {
    console.log(e);
  }
};

export const loadTokenHistory = (
  account: string,
  currency: string,
): AppThunk => async (dispatch) => {
  let tokenHistory: tokenTransaction[] = (
    await hiveEngineAPI.get('accountHistory', {
      params: {account, symbol: currency, type: 'user'},
    })
  ).data;
  tokenHistory = tokenHistory.map((e) => {
    e.amount = `${e.quantity} ${e.symbol}`;
    return e;
  });
  const action: actionPayload<tokenTransaction[]> = {
    type: LOAD_TOKEN_HISTORY,
    payload: tokenHistory,
  };
  dispatch(action);
};
